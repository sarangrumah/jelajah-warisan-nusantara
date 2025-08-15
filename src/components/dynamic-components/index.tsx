import { Award, BookOpen, Building, Camera, Clock, Globe, MapPin, Microscope, Shield, Target, Users } from 'lucide-react';
import React from 'react'

const components = { Building, Users, Target, Award, MapPin, Clock, Shield, BookOpen, Microscope, Globe, Camera };

interface DynamicComponentProps {
  componentName: string | React.ComponentType;
  [key: string]: any;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ componentName, ...props }) => {
  // Handle string component names
  if (typeof componentName === 'string') {
    const TargetComponent = components[componentName as keyof typeof components];
    
    if (!TargetComponent) {
      return <div>Component "{componentName}" not found.</div>;
    }
    
    return <TargetComponent {...props} />;
  }
  
  // Handle direct React component references
  if (typeof componentName === 'function') {
    const Component = componentName;
    return <Component {...props} />;
  }

  return <div>Invalid component type</div>;
}
