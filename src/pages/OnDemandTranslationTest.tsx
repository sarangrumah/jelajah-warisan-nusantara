import React from 'react';
import AgendaSection from '@/components/AgendaSection';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const OnDemandTranslationTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">On-Demand Translation Test</h1>
      <p className="mb-4">
        This page tests the on-demand translation behavior of a single component.
        When you switch languages, the component should not re-translate if the
        translations are already cached.
      </p>
      <div className="mb-4">
        <LanguageSwitcher />
      </div>
      <div className="border p-4">
        <h2 className="text-lg font-semibold mb-2">AgendaSection Component</h2>
        <AgendaSection />
      </div>
    </div>
  );
};

export default OnDemandTranslationTest;