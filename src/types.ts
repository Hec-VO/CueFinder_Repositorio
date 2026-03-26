export interface User {
  name: string;
  age: number;
  registeredAt: string;
}

export interface CravingLog {
  id: string;
  timestamp: string;
  text: string;
  triggers: string[];
}

export interface ToolLog {
  id: string;
  timestamp: string;
  toolId: string;
  toolName: string;
  timeOfDay: string; // Added to track when tasks are performed
}

export interface AppState {
  user: User | null;
  consentAccepted: boolean;
  cravingLogs: CravingLog[];
  toolLogs: ToolLog[];
  lastActivityDate: string | null;
  streak: number;
  reasons: string[];
  enabledTools: string[]; // List of tool IDs that are enabled
  breathingTimes: {
    inhale: number;
    hold: number;
    exhale: number;
  };
}
