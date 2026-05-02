import React, { useEffect, useRef } from 'react';
import { useEditor } from '../context/EditorContext';
import { Play, Pause, Maximize, Settings2 } from 'lucide-react';

export function Preview() {
  const { assets, timelineItems, currentTime, isPlaying, togglePlayback, updateCurrentTime, setIsPlaying } = useEditor();
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  // Find the video that should be playing right now
  const currentItem = timelineItems.find(
    item => currentTime >= item.start && currentTime < item.start + item.duration
  );
  const currentAsset = currentItem ? assets.find(a => a.id === currentItem.assetId && a.status === 'ready') : null;

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = Date.now();
      const loop = () => {
        const now = Date.now();
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        
        updateCurrentTime(prev => {
          const next = prev + dt;
          if (next >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, updateCurrentTime, setIsPlaying]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentTime(Number(e.target.value));
  };

  useEffect(() => {
    if (videoRef.current && currentItem) {
      if (Math.abs(videoRef.current.currentTime - (currentTime - currentItem.start)) > 0.5) {
        videoRef.current.currentTime = currentTime - currentItem.start;
      }
    }
  }, [currentTime, currentItem]);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="w-full aspect-video bg-black rounded-lg border border-neutral-800 shadow-2xl overflow-hidden relative flex flex-col justify-center items-center">
        {currentAsset && currentAsset.type === 'video' ? (
          <video 
            ref={videoRef}
            src={currentAsset.url} 
            className="w-full h-full object-contain"
            autoPlay={isPlaying}
            controls={false}
          />
        ) : (
          <div className="text-neutral-600 flex flex-col items-center select-none">
            <div className="w-16 h-16 border-2 border-dashed border-neutral-700 rounded-xl mb-4 opacity-50"></div>
            <p className="text-sm">No media added to timeline at this time.</p>
          </div>
        )}

      </div>

      {/* Playback Controls */}
      <div className="mt-6 flex items-center justify-between w-full px-4 max-w-md bg-neutral-900 border border-neutral-800 rounded-full h-12 shadow-lg">
        <span className="text-xs font-mono text-neutral-400 w-12 text-center">
          0:{Math.floor(currentTime).toString().padStart(2, '0')}
        </span>
        
        <div className="flex items-center gap-4">
          <button className="text-neutral-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
          </button>
          <button 
            onClick={togglePlayback}
            className="w-10 h-10 bg-white hover:bg-neutral-200 text-black rounded-full flex items-center justify-center transition shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button className="text-neutral-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
           <button className="text-neutral-400 hover:text-white transition">
             <Settings2 className="w-4 h-4" />
           </button>
           <button className="text-neutral-400 hover:text-white transition">
             <Maximize className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
