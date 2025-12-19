import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { SessionTimeoutIndicator } from '@/components/SessionTimeoutIndicator';
import { Clock, Activity, AlertTriangle } from 'lucide-react';

interface SessionTimeoutDemoProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const SessionTimeoutDemo = ({
  timeoutMinutes = 1, // Short timeout for demo
  warningMinutes = 0.5, // Short warning for demo
}: SessionTimeoutDemoProps) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useIdleTimeout({
    timeoutMinutes,
    warningMinutes,
    onTimeout: () => {
      setIsActive(false);
      addTestResult('Session expired - User logged out automatically');
    },
    onWarning: () => {
      addTestResult('Warning displayed - Session will expire soon');
    }
  });

  const simulateActivity = () => {
    addTestResult('User activity detected - Timer reset');
    setIsActive(true);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Timeout Demo
          </CardTitle>
          <CardDescription>
            This demo shows how the automatic session logout works with a short timeout for testing.
            Current settings: {timeoutMinutes} minute timeout, {warningMinutes} minute warning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={simulateActivity} className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Simulate Activity
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
            <Badge variant={isActive ? "default" : "destructive"}>
              {isActive ? "Session Active" : "Session Expired"}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Click "Simulate Activity" to reset the timer</li>
              <li>Wait without activity to see the warning and auto-logout</li>
              <li>Watch the session indicator in the top-right corner</li>
              <li>Check the activity log below for detailed events</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Session Timeout Indicator */}
      <SessionTimeoutIndicator 
        timeoutMinutes={timeoutMinutes} 
        warningMinutes={warningMinutes}
      />

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Activity Log
          </CardTitle>
          <CardDescription>
            Real-time log of session timeout events and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-muted-foreground italic">
                No events yet. Start interacting to see activity logs.
              </p>
            ) : (
              testResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-muted rounded text-sm font-mono"
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            How the session timeout feature works under the hood
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Activity Detection</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mouse movements & clicks</li>
                <li>• Keyboard input</li>
                <li>• Scroll events</li>
                <li>• Touch events (mobile)</li>
                <li>• Tab visibility changes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timeout Process</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Timer resets on activity</li>
                <li>• Warning at configured time</li>
                <li>• Auto logout on timeout</li>
                <li>• Clean token removal</li>
                <li>• Redirect to login</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Code Example</h4>
            <pre className="text-xs overflow-x-auto">
{`import { useIdleTimeout } from '@/hooks/useIdleTimeout';

useIdleTimeout({
  timeoutMinutes: 5,    // 5 minutes to logout
  warningMinutes: 1,    // Warn 1 minute before
  onTimeout: () => {
    // Handle session expiration
  },
  onWarning: () => {
    // Handle warning display
  }
});`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionTimeoutDemo;