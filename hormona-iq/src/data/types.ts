// Shared types used across all domain module files.

export type ModuleSectionType = 'info' | 'scale' | 'checklist' | 'tracker' | 'form';

export interface ModuleSection {
  title: string;
  body?: string;
  items?: string[];
  type?: ModuleSectionType;
}

export type Condition =
  | 'pmdd'
  | 'pcos'
  | 'perimenopause'
  | 'endometriosis'
  | 'adhd'
  | 'general';

export interface ModuleDef {
  id: string;
  title: string;
  subtitle?: string;
  condition: Condition;
  icon?: string;
  sections: ModuleSection[];
}
