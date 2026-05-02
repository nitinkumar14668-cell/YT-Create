import React, { useState } from 'react';
import { Sparkles, Home, Library, Settings, Plus, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useEditor, Asset } from '../context/EditorContext';
import { GenerativeModal } from './GenerativeModal';

export function Sidebar() {
  const { assets, addTimelineItem } = useEditor();
  const [activeTab, setActiveTab] = useState<'media' | 'ai'>('media');
  const [showGenModal, setShowGenModal] = useState(false);

  const handleAddAssetToTimeline = (asset: Asset) => {
    if (asset.status !== 'ready' && asset.type === 'video') return;
    
    addTimelineItem({
      id: 'timeline-' + Date.now().toString(),
      assetId: asset.id,
      start: 0, // In a real app, find the end of the last item
      duration: asset.duration || 8, // Veo default 8s
      trackRow: 0
    });
  };

  return (
    <>
      <div className="w-72 border-r border-neutral-800 bg-neutral-900/50 flex flex-col shrink-0">
        <div className="flex p-2 border-b border-neutral-800 gap-1">
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${activeTab === 'media' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            Media
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md flex items-center justify-center gap-1.5 transition ${activeTab === 'ai' ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Veo AI
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'media' ? (
            <div className="space-y-3">
              <button className="w-full border border-dashed border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-neutral-400 transition">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm">Upload Media</span>
              </button>
              
              <div className="space-y-2 mt-4">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project Assets</h3>
                {assets.length === 0 ? (
                  <p className="text-sm text-neutral-600 text-center py-4">No assets yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {assets.map(asset => (
                      <div 
                        key={asset.id} 
                        className={`relative aspect-video bg-neutral-800 rounded-lg overflow-hidden group ${asset.status === 'ready' || asset.type !== 'video' ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500' : 'opacity-75'}`}
                        onClick={() => handleAddAssetToTimeline(asset)}
                      >
                        {asset.type === 'video' ? (
                          asset.status === 'generating' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800">
                              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse mb-1" />
                              <span className="text-[10px] text-indigo-300">Generating...</span>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                               <video src={asset.url} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Plus className="w-6 h-6 text-white" />
                               </div>
                            </div>
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-700">
                            <ImageIcon className="w-6 h-6 text-neutral-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Plus className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[10px] font-mono">
                           {asset.duration ? `${asset.duration}s` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                <h3 className="font-medium text-indigo-300 text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Veo 3 Video Generation
                </h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                  Generate high-quality video clips using Google's most advanced AI video model.
                </p>
                <button
                  onClick={() => setShowGenModal(true)}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  Generate Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <GenerativeModal isOpen={showGenModal} onClose={() => setShowGenModal(false)} />
    </>
  );
}
