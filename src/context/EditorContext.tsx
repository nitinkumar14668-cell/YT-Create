import React, { createContext, useContext, useState, useRef } from 'react';

export interface Asset {
  id: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  name: string;
  status?: 'ready' | 'generating';
}

export interface TrackItem {
  id: string;
  assetId: string;
  start: number; // time in seconds on timeline
  duration: number; // duration on timeline
  trackRow: number; // which track it sits on
}

interface EditorState {
  assets: Asset[];
  timelineItems: TrackItem[];
  currentTime: number;
  isPlaying: boolean;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  addTimelineItem: (item: TrackItem) => void;
  updateCurrentTime: (time: number | ((prev: number) => number)) => void;
  togglePlayback: () => void;
  setIsPlaying: (playing: boolean) => void;
}

const defaultState: EditorState = {
  assets: [],
  timelineItems: [],
  currentTime: 0,
  isPlaying: false,
  addAsset: () => {},
  updateAsset: () => {},
  addTimelineItem: () => {},
  updateCurrentTime: () => {},
  togglePlayback: () => {},
  setIsPlaying: () => {},
};

const EditorContext = createContext<EditorState>(defaultState);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [timelineItems, setTimelineItems] = useState<TrackItem[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const addAsset = (asset: Asset) => setAssets(prev => [...prev, asset]);
  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };
  const addTimelineItem = (item: TrackItem) => setTimelineItems(prev => [...prev, item]);
  const updateCurrentTime = (time: number | ((prev: number) => number)) => {
    setCurrentTime(prev => typeof time === 'function' ? time(prev) : time);
  };
  const togglePlayback = () => setIsPlaying(prev => !prev);

  return (
    <EditorContext.Provider value={{
      assets, 
      timelineItems, 
      currentTime, 
      isPlaying, 
      addAsset, 
      updateAsset,
      addTimelineItem, 
      updateCurrentTime, 
      togglePlayback,
      setIsPlaying
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
