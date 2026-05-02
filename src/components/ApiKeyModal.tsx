import React from 'react';
import { Key } from 'lucide-react';

export function ApiKeyModal({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="bg-indigo-500/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
          <Key className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Select Paid API Key</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Veo 3 video generation requires a paid Google Cloud project. Please select your API key to continue.
          <br/>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline mt-3 inline-block">
            Learn more about billing
          </a>
        </p>
        <button
          onClick={onSelect}
          className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
}
