import type { Asset, Case } from '../types';
import casesData from './cases.json';
import assetsData from './assets.json';

export const mockAssets: Asset[] = assetsData as Asset[];
export const mockCases: Case[] = casesData as Case[];
