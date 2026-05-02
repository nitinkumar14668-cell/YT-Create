import React, { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EditorLayout } from './components/EditorLayout';
import { EditorProvider } from './context/EditorContext';

export default function App() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  // Check for specialized key because Veo requires paid project.
  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success as per docs
      setHasKey(true);
    }
  }

  if (hasKey === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return <ApiKeyModal onSelect={handleSelectKey} />;
  }

  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
