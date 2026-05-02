import React, { useState, useRef } from 'react';
import { X, Sparkles, Upload, Loader2 } from 'lucide-react';
import { generateVeoVideo } from '../lib/veo';
import { useEditor } from '../context/EditorContext';

export function GenerativeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addAsset, updateAsset } = useEditor();
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && !imageBase64) {
      setError('Please provide either a prompt or an image.');
      return;
    }
    
    setIsGenerating(true);
    setError('');

    // Preemptively add to assets as 'generating' state
    const newAssetId = 'asset-' + Date.now().toString();
    addAsset({
      id: newAssetId,
      type: 'video',
      url: '',
      name: prompt ? prompt.substring(0, 20) + '...' : 'Generated Video',
      status: 'generating'
    });

    onClose();

    try {
      const videoUri = await generateVeoVideo(prompt, imageBase64, imageFile?.type);
      
      if (videoUri) {
        // Fetch it so we have a blob url to play without CORS issues,
        // Wait, the skill says:
        // const response = await fetch(downloadLink, { headers: { 'x-goog-api-key': apiKey } });
        // Let's implement that blob fetch.
        
        const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
        const res = await fetch(videoUri, {
          method: 'GET',
          headers: {
            'x-goog-api-key': key || '',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to download video: ' + res.statusText);
        }
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        updateAsset(newAssetId, {
          url: blobUrl,
          status: 'ready',
          duration: 8 // default veo generation length is typically ~8sec or 5sec based on settings
        });
      } else {
        updateAsset(newAssetId, { name: 'Failed to generate' });
      }
    } catch (e: any) {
      console.error(e);
      updateAsset(newAssetId, { name: 'Error: ' + e.message });
    } finally {
      setIsGenerating(false);
      setPrompt('');
      setImageFile(null);
      setImageBase64('');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Generate with Veo 3</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Text Prompt (Optional)</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl max-h-32 min-h-24 p-3 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition resize-none placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Reference Image (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-neutral-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 bg-neutral-950 rounded-xl flex items-center justify-center cursor-pointer transition overflow-hidden relative"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {imageBase64 ? (
                <img src={imageBase64} alt="Reference" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-500">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </div>
            {imageBase64 && (
              <button onClick={() => {setImageBase64(''); setImageFile(null);}} className="text-xs text-red-400 hover:text-red-300 transition block mt-1">
                Remove image
              </button>
            )}
            <p className="text-xs text-neutral-500 mt-1">First-frame image condition for Veo. Aspect ratio will be set to 16:9 natively.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/50 mt-auto">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-neutral-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt && !imageBase64)}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Video'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
