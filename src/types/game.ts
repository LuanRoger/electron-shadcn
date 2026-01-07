export interface GameResult {
  id: string;
  user_id: string;
  map: string;
  kills: number;
  rank: number;
  created_at: string;
}

export interface GameRoom {
  id: string;
  owner_id: string;
  name: string;
  status: 'waiting' | 'in_game' | 'finished';
  created_at: string;
  metadata?: any; // e.g., game settings, win conditions
}

export interface Participant {
  room_id: string;
  user_id: string;
  joined_at: string;
}

