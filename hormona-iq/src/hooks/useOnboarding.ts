// useOnboarding — encapsulates onboarding step state extracted from start.tsx.
//
// start.tsx uses:
//   const [step, setStep] = useState<StepKey>(1)
//   const next = (target: StepKey) => setStep(target)
//   const back = () => { ... step-specific back logic }
//   const visibleStepIndex = computed from step (1-5)
//   5 numbered steps (1, 2, 3, 4, 5) plus sub-steps ('block','guardian','3.5','3.7','3.8')
//
// This hook exposes the simple numeric step surface.  Sub-steps (block, guardian,
// 3.5, 3.7, 3.8) map to the closest visible parent step for progress/isLastStep.

import { useCallback, useState } from 'react';

// ─────────────────────────────────────────────
// Types (mirrors start.tsx StepKey)
// ─────────────────────────────────────────────

type StepKey =
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

export interface OnboardingResult {
  /** Raw internal step key — kept as number for the interface contract */
  step: number;
  totalSteps: number;
  canProceed: boolean;
  goNext: () => void;
  goBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// ─────────────────────────────────────────────
// Helpers (ported from start.tsx visibleStepIndex)
// ─────────────────────────────────────────────

const TOTAL_STEPS = 5;

function visibleIndex(s: StepKey): number {
  if (s === 1 || s === 'block' || s === 'guardian') return 1;
  if (s === 2) return 2;
  if (s === 3 || s === '3.5' || s === '3.7' || s === '3.8') return 3;
  if (s === 4) return 4;
  if (s === 5) return 5;
  return 1;
}

/**
 * Linear "go next" progression through main steps only.
 * Sub-steps (block, guardian, 3.5, 3.7, 3.8) are treated as extensions of
 * their parent and move forward in sequence.
 */
function nextStep(current: StepKey): StepKey {
  switch (current) {
    case 1:       return 2;
    case 'block': return 1;    // blocked — stays on step 1 context
    case 'guardian': return 2;
    case 2:       return 3;
    case 3:       return '3.5';
    case '3.5':   return '3.7';
    case '3.7':   return '3.8';
    case '3.8':   return 4;
    case 4:       return 5;
    case 5:       return 5;    // last step; caller handles finish()
    default:      return 1;
  }
}

/** Back navigation from start.tsx back() */
function prevStep(current: StepKey): StepKey {
  switch (current) {
    case 1:       return 1;
    case 'block':
    case 'guardian': return 1;
    case 2:       return 1;
    case 3:       return 2;
    case '3.5':   return 3;
    case '3.7':   return 3;
    case '3.8':   return '3.7';
    case 4:       return '3.8';
    case 5:       return 4;
    default:      return 1;
  }
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * @param initialStep - Override the starting step (default: 1). Primarily
 *   useful for deep-linking or resuming a saved onboarding session.
 */
export function useOnboarding(initialStep: StepKey = 1): OnboardingResult {
  const [internalStep, setInternalStep] = useState<StepKey>(initialStep);

  const goNext = useCallback((): void => {
    setInternalStep((s) => nextStep(s));
  }, []);

  const goBack = useCallback((): void => {
    setInternalStep((s) => prevStep(s));
  }, []);

  const visible = visibleIndex(internalStep);

  return {
    step: visible,
    totalSteps: TOTAL_STEPS,
    canProceed: internalStep !== 'block',
    goNext,
    goBack,
    isFirstStep: visible === 1,
    isLastStep: visible === TOTAL_STEPS,
  };
}
