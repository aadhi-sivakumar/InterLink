import { useState, useEffect, useRef, useCallback } from 'react';
import { View, findNodeHandle, UIManager } from 'react-native';
import { hasCompletedOnboarding, completeOnboarding } from '../utils/onboarding';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

interface UseOnboardingReturn {
  currentStep: number;
  isActive: boolean;
  stepRefs: { [key: string]: React.RefObject<View> };
  getStepPosition: (stepId: string) => Promise<{ x: number; y: number; width: number; height: number } | null>;
  startOnboarding: () => void;
  nextStep: () => void;
  skipOnboarding: () => void;
  steps: OnboardingStep[];
}

export function useOnboarding(steps: OnboardingStep[]): UseOnboardingReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const stepRefs = useRef<{ [key: string]: React.RefObject<View> }>({});

  steps.forEach((step) => {
    if (!stepRefs.current[step.id]) {
      stepRefs.current[step.id] = { current: null } as React.RefObject<View>;
    }
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      if (!completed) {
        setIsActive(true);
      }
    };
    checkOnboarding();
  }, []);

  const getStepPosition = useCallback(async (stepId: string) => {
    const ref = stepRefs.current[stepId];
    if (!ref?.current) return null;

    return new Promise<{ x: number; y: number; width: number; height: number } | null>((resolve) => {
      const nodeHandle = findNodeHandle(ref.current);
      if (!nodeHandle) {
        resolve(null);
        return;
      }

      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        resolve({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    });
  }, []);

  const startOnboarding = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      setIsActive(false);
    }
  }, [currentStep, steps.length]);

  const skipOnboarding = useCallback(() => {
    completeOnboarding();
    setIsActive(false);
  }, []);

  return {
    currentStep,
    isActive,
    stepRefs: stepRefs.current,
    getStepPosition,
    startOnboarding,
    nextStep,
    skipOnboarding,
    steps,
  };
}

