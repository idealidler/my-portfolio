import React from 'react';

export default function FocusSectionDetailed({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-6 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-full overflow-auto rounded-3xl bg-white/90 shadow-2xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-indigo-700 hover:text-indigo-900 text-3xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
