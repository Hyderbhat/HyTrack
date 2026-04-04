const User = require('../models/User');
const Session = require('../models/Session');
const { hashPassword, verifyPassword } = require('../utils/passwords');
const { generateSessionToken, hashToken, buildSessionExpiry } = require('../utils/tokens');
const { toPublicUser } = require('../models/User');
const { saveAvatar } = require('../services/avatarStorage');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must include at least one number';
  return '';
}

async function createSession(user) {
  const token = generateSessionToken();
  const expiresAt = buildSessionExpiry();

  await Session.deleteExpired();
  await Session.create({ userId: user.id, tokenHash: hashToken(token), expiresAt });

  return { token, user: toPublicUser(user) };
}

async function signup(req, res) {
  try {
    const { name, email, password, budget, avatarUrl } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (!validateEmail(email)) return res.status(400).json({ error: 'Enter a valid email address' });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(409).json({ error: 'An account with that email already exists' });

    const parsedBudget = Number(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ error: 'Budget must be zero or greater' });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      budget: parsedBudget || 50000,
      avatarUrl: avatarUrl || '',
    });

    const publicUser = avatarUrl?.startsWith('data:image/')
      ? await User.updateProfile(user.id, {
          name: user.name,
          budget: user.budget,
          avatarUrl: await saveAvatar({ userId: user.id, avatarDataUrl: avatarUrl, currentAvatarUrl: user.avatar_url }),
        })
      : user;

    return res.status(201).json(await createSession(publicUser));
  } catch (error) {
    console.error('signup error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findByEmail(email.trim());
    if (!user?.password_hash) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    return res.json(await createSession(user));
  } catch (error) {
    console.error('login error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function me(req, res) {
  return res.json({ user: req.user });
}

async function updateMe(req, res) {
  try {
    const { name, budget, avatarUrl } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const parsedBudget = Number(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ error: 'Budget must be zero or greater' });
    }

    const storedAvatarUrl = await saveAvatar({
      userId: req.user.id,
      avatarDataUrl: avatarUrl || '',
      currentAvatarUrl: req.user.avatar_url || '',
    });

    const user = await User.updateProfile(req.user.id, {
      name,
      budget: parsedBudget,
      avatarUrl: storedAvatarUrl,
    });

    return res.json({ user });
  } catch (error) {
    console.error('updateMe error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const account = await User.findByEmail(req.user.email);
    const isValid = await verifyPassword(currentPassword, account?.password_hash || '');
    if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });

    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ error: passwordError });

    await User.updatePassword(req.user.id, await hashPassword(newPassword));
    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('changePassword error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  try {
    await Session.deleteByTokenHash(req.session.tokenHash);
    return res.status(204).send();
  } catch (error) {
    console.error('logout error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { signup, login, me, updateMe, changePassword, logout };
