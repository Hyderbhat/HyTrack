const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const AVATAR_DIR = path.join(__dirname, '..', 'uploads', 'avatars');

function extractImageParts(dataUrl) {
  const match = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/i.exec(dataUrl || '');
  if (!match) {
    throw new Error('Avatar image must be a valid base64 data URL');
  }

  const mimeType = match[1].toLowerCase();
  const extension = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : mimeType.split('/')[1];
  return { extension, buffer: Buffer.from(match[3], 'base64') };
}

async function saveAvatar({ userId, avatarDataUrl, currentAvatarUrl = '' }) {
  if (!avatarDataUrl) {
    return currentAvatarUrl || '';
  }

  if (!avatarDataUrl.startsWith('data:image/')) {
    return avatarDataUrl;
  }

  await fs.mkdir(AVATAR_DIR, { recursive: true });
  const { extension, buffer } = extractImageParts(avatarDataUrl);
  const filename = `${userId}-${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(AVATAR_DIR, filename);
  await fs.writeFile(filePath, buffer);

  if (currentAvatarUrl?.startsWith('/uploads/avatars/')) {
    const oldPath = path.join(AVATAR_DIR, path.basename(currentAvatarUrl));
    fs.unlink(oldPath).catch(() => {});
  }

  return `/uploads/avatars/${filename}`;
}

module.exports = { saveAvatar };
