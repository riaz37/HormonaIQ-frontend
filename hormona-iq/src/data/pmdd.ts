// PMDD module data.
// No modules are currently defined for PMDD — the condition is reserved in the
// Condition type and will be populated in a future sprint.

import type { ModuleDef } from './types';

export type { ModuleSectionType, ModuleSection, Condition, ModuleDef } from './types';

export const pmddModules: readonly ModuleDef[] = [] as const;
