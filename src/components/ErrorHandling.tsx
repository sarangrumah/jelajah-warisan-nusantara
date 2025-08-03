import { useToast } from '@/hooks/use-toast';
import { ReactElement, cloneElement, Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactElement },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactElement }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced notification system
export const useNotifications = () => {
  const { toast } = useToast();

  const success = (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 3000,
    });
  };

  const error = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
      duration: 5000,
    });
  };

  const warning = (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 4000,
    });
  };

  const info = (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 3000,
    });
  };

  const loading = (title: string, description?: string) => {
    return toast({
      title,
      description,
      duration: Infinity, // Keep until dismissed
    });
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
  };
};

// Loading states component
export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Empty state component
export const EmptyState = ({ 
  title = 'No data found', 
  description, 
  action 
}: { 
  title?: string; 
  description?: string; 
  action?: ReactElement;
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Info className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action && cloneElement(action)}
    </div>
  </div>
);