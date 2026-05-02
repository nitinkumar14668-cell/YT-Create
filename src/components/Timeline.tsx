import React from 'react';
import { useEditor } from '../context/EditorContext';
import { Scissors, Copy, Trash2, SplitSquareHorizontal } from 'lucide-react';

export function Timeline() {
  const { timelineItems, assets, currentTime, updateCurrentTime } = useEditor();

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Basic approximate seek based on click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const maxTime = 60; // Just mock 60s max timeline for visually showing something
    updateCurrentTime(percentage * maxTime);
  };

  return (
    <div className="h-64 border-t border-neutral-800 bg-neutral-900 flex flex-col shrink-0">
      
      {/* Timeline toolbar */}
      <div className="h-10 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-950">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Split">
            <Scissors className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center text-xs text-neutral-500 font-mono w-16 justify-between">
             <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
             <span>/</span>
             <span>1:00</span>
           </div>
           <input 
             type="range" 
             min={0}
             max={60}
             step={0.1}
             value={currentTime}
             onChange={(e) => updateCurrentTime(Number(e.target.value))}
             className="w-24 accent-indigo-500 cursor-pointer" 
           />
        </div>
      </div>

      {/* Tracks Area */}
      <div 
        className="flex-1 overflow-x-auto overflow-y-auto relative p-4 custom-scrollbar"
      >
        {/* Playhead Mock */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
          style={{ left: `${(currentTime / 60) * 100}%` }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-sm -ml-[5px] top-0 absolute"></div>
        </div>

        {/* Track 1 */}
        <div 
          className="h-16 bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden mb-2 cursor-pointer"
          onClick={handleTimelineClick}
        >
          <div className="absolute left-0 top-0 bottom-0 bg-neutral-800/30 w-full striped-pattern pointer-events-none"></div>
          
          {timelineItems.map((item, idx) => {
            const asset = assets.find(a => a.id === item.assetId);
            return (
              <div 
                key={item.id}
                className="absolute top-1 bottom-1 bg-indigo-500/20 border border-indigo-500/50 rounded-md overflow-hidden group shadow-lg"
                style={{ 
                  left: `${(item.start / 60) * 100}%`, 
                  width: `${(item.duration / 60) * 100}%` 
                }}
              >
                {asset?.type === 'video' && asset.url && (
                  <video src={asset.url} className="h-full w-auto opacity-50 object-cover" />
                )}
                <div className="absolute inset-0 p-1">
                  <span className="text-[10px] font-semibold text-white drop-shadow-md truncate block">
                    {asset?.name || 'Clip'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Track 2 */}
        <div className="h-16 bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden mb-2 pointer-events-none opacity-50">
           <div className="absolute left-0 top-0 bottom-0 bg-neutral-800/10 w-full striped-pattern pointer-events-none"></div>
        </div>

      </div>

    </div>
  );
}
