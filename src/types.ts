
export interface Participant {
  id: string;
  name: string;
  password?: string;
  drawnId?: string;
}

export interface SecretSantaEvent {
  id: string;
  name: string;
  participants: Participant[];
  isDrawn: boolean;
  createdAt: number;
}

export interface AppStore {
  events: SecretSantaEvent[];
  adminPassword?: string; // Simple local password
}

export enum ViewMode {
  PARTICIPANT = 'participant',
  ADMIN = 'admin'
}
