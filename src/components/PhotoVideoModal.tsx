import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface PhotoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (xpReward: number) => void;
  currentBirdName: string;
}

export default function PhotoVideoModal({
  isOpen,
  onClose,
  onUploadSuccess,
  currentBirdName,
}: PhotoVideoModalProps) {
  const [caption, setCaption] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Simulate selecting a dummy file
    setSelectedFile('simulated_bird_photo.jpg');
  };

  const handleSelectFile = () => {
    setSelectedFile('simulated_bird_photo.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadDone(true);
      setTimeout(() => {
        onUploadSuccess(20); // Award 20 XP
        // Reset state
        setCaption('');
        setSelectedFile(null);
        setUploadDone(false);
        onClose();
      }, 1200);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div>
              <h3 className="font-display font-black text-lg text-slate-800">
                Share a Flock Moment
              </h3>
              <p className="text-xs text-slate-400">
                Post a photo or video of your bird to the community feed.
              </p>
            </div>

            {uploadDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Moment Posted successfully!</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Awarded +20 XP & +2 Seeds!</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleSelectFile}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 transition-colors cursor-pointer text-center bg-slate-50/30 ${
                    dragOver ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200'
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-1.5 text-emerald-600">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs font-bold">{selectedFile}</span>
                      <span className="text-[10px] text-slate-400">(Ready to share)</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Drag and drop or click to upload</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, MP4 up to 50MB</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Caption Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Caption / Description
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={`What is ${currentBirdName} up to today?...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all resize-none"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Post Moment'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
