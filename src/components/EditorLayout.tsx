import React from 'react';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';
import { Timeline } from './Timeline';
import { Upload, Download, Play, Video } from 'lucide-react';

export function EditorLayout() {
  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-rose-500 rounded-md p-1.5">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-lg text-neutral-100">VeoCreate</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition">
            Settings
          </button>
          <button className="text-sm font-medium bg-white text-black hover:bg-neutral-200 px-4 py-1.5 rounded-lg flex items-center gap-2 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Assets / Tools) */}
        <Sidebar />

        {/* Center Canvas (Preview Player) */}
        <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
          <div className="flex-1 p-4 flex items-center justify-center">
            <Preview />
          </div>
          
          {/* Bottom Timeline */}
          <Timeline />
        </div>
      </main>
    </div>
  );
}
