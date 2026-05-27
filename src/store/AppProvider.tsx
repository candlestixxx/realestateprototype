import { type ReactNode } from 'react';
import { AppContext } from './context';
import { defaultState } from './types';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppContext.Provider value={{ state: defaultState, dispatch: () => null }}>
      {children}
    </AppContext.Provider>
  );
};