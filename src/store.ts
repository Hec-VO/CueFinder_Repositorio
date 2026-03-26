import { AppState } from './types';

const STORAGE_KEY = 'cuefinder_state';

export const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        cravingLogs: parsed.cravingLogs || [],
        toolLogs: parsed.toolLogs || [],
        streak: parsed.streak || 0,
        consentAccepted: parsed.consentAccepted || false,
        reasons: parsed.reasons || ['Por mi salud', 'Por mi familia', 'Para ahorrar dinero', 'Para respirar mejor'],
        enabledTools: parsed.enabledTools || [], // All disabled by default
        breathingTimes: parsed.breathingTimes || { inhale: 4, hold: 7, exhale: 8 },
      };
    } catch (e) {
      console.error('Failed to parse stored state', e);
    }
  }
  return {
    user: null,
    consentAccepted: false,
    cravingLogs: [],
    toolLogs: [],
    lastActivityDate: null,
    streak: 0,
    reasons: ['Por mi salud', 'Por mi familia', 'Para ahorrar dinero', 'Para respirar mejor'],
    enabledTools: [], // All disabled by default
    breathingTimes: { inhale: 4, hold: 7, exhale: 8 },
  };
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
