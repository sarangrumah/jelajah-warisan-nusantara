import SessionTimeoutDemo from '@/components/SessionTimeoutDemo';

const SessionTimeoutTest = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Session Timeout Testing</h1>
          <p className="text-muted-foreground">
            Test the automatic session logout feature with configurable timeout settings.
            This page demonstrates how the idle timeout works for the admin panel.
          </p>
        </div>
        
        <SessionTimeoutDemo timeoutMinutes={1} warningMinutes={0.5} />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">For Production Use</h3>
          <p className="text-sm text-muted-foreground">
            In the actual admin panel, the timeout is set to 5 minutes with a 1-minute warning.
            This test page uses shorter timeouts (1 minute timeout, 30-second warning) for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutTest;