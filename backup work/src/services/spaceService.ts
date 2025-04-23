// src/services/spaceService.ts
import api from './api';
import { Space, SpaceFilter } from '../types/space.types';

export const spaceService = {
  async getSpaces(filter?: SpaceFilter): Promise<Space[]> {
    const response = await api.get('/spaces', { params: filter });
    return response.data;
  },

  async getSpaceById(id: string): Promise<Space> {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },

  async getSpaceAvailability(id: string, date: Date): Promise<{ available: boolean; timeSlots: { start: Date; end: Date }[] }> {
    const response = await api.get(`/spaces/${id}/availability`, {
      params: { date: date.toISOString().split('T')[0] },
    });
    return response.data;
  },
};