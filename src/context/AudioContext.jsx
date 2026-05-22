import { createContext, useMemo } from 'react';

export const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  // Use useMemo so the audio object is created once and stable
  const audio = useMemo(() => new Audio(), []);

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}