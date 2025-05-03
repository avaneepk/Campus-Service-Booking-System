// src/types/space.types.ts
export type SpaceType = 'ping_pong' | 'karaoke' | 'sauna' | 'music_band' | 'meeting';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  capacity: number;
  location: string;
  floor: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface SpaceFilter {
  type?: SpaceType;
  capacity?: number;
  floor?: number;
  date?: Date;
}