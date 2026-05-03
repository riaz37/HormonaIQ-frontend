// Central barrel — re-exports all domain module data and shared types.
export * from './types';
export * from './pmdd';
export * from './pcos';
export * from './perimenopause';
export * from './adhd';
export * from './endometriosis';

import type { ModuleDef } from './types';
import { pmddModules } from './pmdd';
import { pcosModules } from './pcos';
import { periModules } from './perimenopause';
import { adhdModules } from './adhd';
import { endoModules } from './endometriosis';

export const ALL_MODULES: readonly ModuleDef[] = [
  ...pcosModules,
  ...endoModules,
  ...adhdModules,
  ...periModules,
  ...pmddModules,
] as const;

export function findModule(id: string): ModuleDef | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}
