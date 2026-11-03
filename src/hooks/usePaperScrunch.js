import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * usePaperScrunch
 * Orchestrates the stop-motion paper folding/un-crumple animation on page load,
 * page refresh, and manual trigger, exactly as implemented on portal.drool.community.
 */
export function usePaperScrunch() {
  // State: 'in' (unfolding onto desk) | 'idle' (desk fully active) | 'out' (crumpling)
  const [scrunchState, setScrunchState] = useState('in');
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // If user prefers reduced motion, skip straight to idle
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScrunchState('idle');
      return;
    }

    // Play un-crumple animation on initial mount / refresh (0.9s duration)
    setScrunchState('in');
    timerRef.current = setTimeout(() => {
      setScrunchState('idle');
      timerRef.current = null;
    }, 950);

    return () => {
      clearTimer();
    };
  }, []);

  // Replay the full fold & unfold cycle
  const replayFold = useCallback(() => {
    clearTimer();
    setScrunchState('out');
    timerRef.current = setTimeout(() => {
      setScrunchState('in');
      timerRef.current = setTimeout(() => {
        setScrunchState('idle');
        timerRef.current = null;
      }, 950);
    }, 900);
  }, []);

  return { scrunchState, replayFold };
}
