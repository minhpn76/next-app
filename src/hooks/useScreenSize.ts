import { theme } from '@dls/web';
import { useState, useEffect, useCallback } from 'react';

const useScreenSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const getQuery = useCallback(() => {
    const templateMaxWidth = `(max-width: {size})`;
    switch (size) {
      case 'xs':
        return templateMaxWidth.replace('{size}', theme.breakpoints.xs);
      case 'sm':
        return templateMaxWidth.replace('{size}', theme.breakpoints.sm);
      case 'md':
        return templateMaxWidth.replace('{size}', theme.breakpoints.md);
      case 'lg':
        return templateMaxWidth.replace('{size}', theme.breakpoints.lg);
      case 'xl':
        return templateMaxWidth.replace('{size}', theme.breakpoints.xl);
    }
  }, [size]);

  const [matches, setMatches] = useState<boolean>(getMatches(getQuery()));

  const handleChange = useCallback(() => {
    setMatches(getMatches(getQuery()));
  }, [getQuery]);

  useEffect(() => {
    const matchMedia = window.matchMedia(getQuery());
    // Triggered at the first client-side load and if query changes
    handleChange();
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [getQuery, handleChange, size]);

  return matches;
};

export default useScreenSize;
