import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const STORAGE_KEY = 'hytrack.currency';
const DEFAULT_CURRENCY = 'INR';

export const CURRENCY_OPTIONS = [
  { code: 'INR', label: 'Indian Rupee (INR)' },
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'AED', label: 'UAE Dirham (AED)' },
];

const ALLOWED = new Set(CURRENCY_OPTIONS.map((item) => item.code));
const CurrencyContext = createContext(null);

function readInitialCurrency() {
  const saved = localStorage.getItem(STORAGE_KEY) || '';
  return ALLOWED.has(saved) ? saved : DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState(readInitialCurrency);

  const setCurrency = (nextCurrency) => {
    const normalized = ALLOWED.has(nextCurrency) ? nextCurrency : DEFAULT_CURRENCY;
    setCurrencyState(normalized);
    localStorage.setItem(STORAGE_KEY, normalized);
  };

  useEffect(() => {
    const serverCurrency = user?.currency;
    if (ALLOWED.has(serverCurrency) && serverCurrency !== currency) {
      setCurrencyState(serverCurrency);
      localStorage.setItem(STORAGE_KEY, serverCurrency);
    }
  }, [currency, user?.currency]);

  const value = useMemo(
    () => ({ currency, setCurrency, currencyOptions: CURRENCY_OPTIONS }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
