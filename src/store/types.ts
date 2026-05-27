import { type User } from '../types/api';
import { type BusinessTypeKey } from '../constants';

export interface AppState {
  user: User | null;
  businessType: BusinessTypeKey;
  theme: 'light' | 'dark';
}

export const defaultState: AppState = {
  user: null,
  businessType: 'real_estate',
  theme: 'light'
};

export type Action = { type: 'NO_OP' };