// Shared onboarding types used across step components and the shell.

export type StepKey =
  | 1
  | 'block'
  | 'guardian'
  | 2
  | 3
  | '3.5'
  | '3.7'
  | '3.8'
  | 4
  | 5;

export type ConditionName =
  | 'PMDD'
  | 'PCOS'
  | 'Perimenopause'
  | 'ADHD overlap'
  | 'Endometriosis'
  | "I'm still figuring it out";

export type EdAnswer = 'yes' | 'currently' | 'past' | 'prefer-not' | 'no';
export type TrackingHistory = 'new' | 'under-year' | 'years';
export type NotifChoice = 'allow' | 'deny';
export type PerimenopausalStatus = 'unknown' | 'not_yet' | 'perimenopause' | 'postmenopause';
export type HbcType =
  | 'combined_pill'
  | 'progestin_only_pill'
  | 'hormonal_iud'
  | 'implant'
  | 'injection'
  | 'patch'
  | 'ring';

export interface Condition {
  readonly name: ConditionName;
  readonly desc: string;
  readonly emoji: string;
}
