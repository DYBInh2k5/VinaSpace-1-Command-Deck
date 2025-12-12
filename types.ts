export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export enum ShipSystemStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface SystemState {
  propulsion: ShipSystemStatus;
  lifeSupport: ShipSystemStatus;
  navigation: ShipSystemStatus;
  communications: ShipSystemStatus;
  warpSpeed: number; // 0 to 10
}