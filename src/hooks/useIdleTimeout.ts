import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

interface UseIdleTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
  /** Fired when user activity resets the timer after a warning was shown. */
  onActive?: () => void;
}

const DEFAULT_TIMEOUT_MINUTES = 5;
const DEFAULT_WARNING_MINUTES = 1;

export const useIdleTimeout = ({
  timeoutMinutes = DEFAULT_TIMEOUT_MINUTES,
  warningMinutes = DEFAULT_WARNING_MINUTES,
  onTimeout,
  onWarning,
  onActive,
}: UseIdleTimeoutOptions = {}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isWarningShown = useRef(false);
  const lastActivityRef = useRef(Date.now());

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    const wasWarning = isWarningShown.current;
    clearTimers();
    lastActivityRef.current = Date.now();
    isWarningShown.current = false;

    // If the user became active while a warning was on screen, tell the UI to
    // dismiss the countdown so it doesn't keep draining for an active session.
    if (wasWarning) {
      onActive?.();
    }

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timeout
    if (warningMinutes < timeoutMinutes) {
      warningTimeoutRef.current = setTimeout(() => {
        if (!isWarningShown.current) {
          isWarningShown.current = true;
          onWarning?.();
          toast({
            title: "Session Warning",
            description: `Your session will expire in ${warningMinutes} minute${warningMinutes > 1 ? 's' : ''}. Click to continue working.`,
            duration: 10000,
          });
        }
      }, warningMs);
    }

    // Set timeout for logout
    timeoutRef.current = setTimeout(async () => {
      await handleTimeout();
    }, timeoutMs);
  }, [timeoutMinutes, warningMinutes, clearTimers, onWarning, onActive, toast]);

  const handleTimeout = useCallback(async () => {
    clearTimers();
    await signOut();
    onTimeout?.();
    toast({
      title: "Session Expired",
      description: "You have been automatically logged out due to inactivity.",
      variant: "destructive",
    });
    navigate('/auth');
  }, [signOut, onTimeout, clearTimers, toast, navigate]);

  // Track various types of user activity
  const trackActivity = useCallback(() => {
    // Only reset if we're not in a warning state or if enough time has passed
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    const minInterval = 1000; // Don't reset too frequently (1 second)

    if (timeSinceLastActivity >= minInterval) {
      resetTimer();
    }
  }, [resetTimer]);

  // Activity event listeners
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const throttledTrackActivity = (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(trackActivity, 100); // Throttle to 100ms
      };
    })();

    events.forEach(event => {
      document.addEventListener(event, throttledTrackActivity, true);
    });

    // Track visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledTrackActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimers();
    };
  }, [trackActivity, clearTimers]);

  // Start the timer on mount
  useEffect(() => {
    resetTimer();
    return clearTimers;
  }, [resetTimer, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    resetTimer,
    clearTimers,
    isWarningShown: isWarningShown.current,
  };
};