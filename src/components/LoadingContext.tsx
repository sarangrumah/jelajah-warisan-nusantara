import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Module-level setter for global loading control
let globalSetLoading: ((value: boolean) => void) | undefined = undefined;

/**
 * Call this function from anywhere (even outside React components)
 * to set the global loading state.
 */
export function setGlobalLoading(value: boolean) {
  if (globalSetLoading) {
    globalSetLoading(value);
  } else {
    // Optionally warn if called before provider is mounted
    if (process.env.NODE_ENV !== "production") {
      console.warn("setGlobalLoading called before LoadingProvider is mounted.");
    }
  }
}

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  // Assign the setter on mount
  React.useEffect(() => {
    globalSetLoading = setLoading;
    return () => {
      globalSetLoading = undefined;
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};