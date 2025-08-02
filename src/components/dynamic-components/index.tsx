import { Award, BookOpen, Building, Camera, Clock, Globe, MapPin, Microscope, Shield, Target, Users } from 'lucide-react';
import React from 'react'

const components = { Building, Users, Target, Award, MapPin, Clock, Shield, BookOpen, Microscope, Globe, Camera };

export const DynamicComponent = ({ componentName, ...props }) => {
  const TargetComponent = components[componentName];

  if (!TargetComponent) {
    // Handle cases where the component name is not found
    return <div>Component "{componentName}" not found.</div>;
  }

  return <TargetComponent {...props} />;
}
