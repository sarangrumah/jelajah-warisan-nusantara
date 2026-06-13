import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

interface SessionTimeoutIndicatorProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  className?: string;
}

export const SessionTimeoutIndicator = ({
  timeoutMinutes = 5,
  warningMinutes = 1,
  className = "",
}: SessionTimeoutIndicatorProps) => {
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60); // in seconds
  const [isWarning, setIsWarning] = useState(false);

  // Stable callbacks so they don't churn the idle-timeout's resetTimer identity
  // on every render (which previously rescheduled timers and broke activity reset).
  const handleWarning = useCallback(() => {
    setIsWarning(true);
    setTimeRemaining(warningMinutes * 60);
  }, [warningMinutes]);

  const handleActive = useCallback(() => {
    // User is active again — dismiss the warning and restore the full window.
    setIsWarning(false);
    setTimeRemaining(timeoutMinutes * 60);
  }, [timeoutMinutes]);

  const handleTimeout = useCallback(() => {
    setIsWarning(false);
    setTimeRemaining(0);
  }, []);

  useIdleTimeout({
    timeoutMinutes,
    warningMinutes,
    onWarning: handleWarning,
    onActive: handleActive,
    onTimeout: handleTimeout,
  });

  useEffect(() => {
    if (!isWarning) {
      setTimeRemaining(timeoutMinutes * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWarning, timeoutMinutes]);

  if (!isWarning && timeRemaining === timeoutMinutes * 60) {
    return null; // Don't show indicator when session is fresh
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${className}`}>
      <Badge 
        variant={isWarning ? "destructive" : "secondary"}
        className="flex items-center gap-2 px-3 py-2 shadow-lg"
      >
        {isWarning ? (
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isWarning ? 'Session expires in ' : 'Session active: '}
          {formatTime(timeRemaining)}
        </span>
      </Badge>
    </div>
  );
};