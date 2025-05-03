import { useState, useEffect } from 'react';
import { spaceService } from '../services/spaceService';
import { Space } from '../types/space.types';

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await spaceService.getSpaces();
        setSpaces(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch spaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  return { spaces, isLoading, error };
};