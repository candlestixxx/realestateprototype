import { createContext, useContext } from 'react';
import { type AppState, type Action, defaultState } from './types';

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>; // Type to be expanded when fully implemented
}>({
  state: defaultState,
  dispatch: () => null
});

export const useAppStore = () => useContext(AppContext);