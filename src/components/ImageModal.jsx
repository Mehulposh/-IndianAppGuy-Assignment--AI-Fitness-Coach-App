import React from "react";
import { X, Loader, AlertTriangle } from "lucide-react";

const ImageModal = ({ isOpen, onClose, title, imageUrl, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                <Loader className="w-10 h-10 animate-spin text-indigo-500" />
                <span className="mt-3 text-sm font-medium">Generating image...</span>
              </div>
            )}
            {!isLoading && imageUrl && (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            )}
            {!isLoading && !imageUrl && (
              <div className="flex flex-col items-center text-center p-4 text-red-500">
                <AlertTriangle className="w-10 h-10" />
                <span className="mt-3 text-sm font-medium">Failed to generate image.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;
