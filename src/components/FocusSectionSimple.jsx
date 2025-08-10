// src/components/FocusSectionSimple.jsx
import React from 'react';

export default function FocusSectionSimple({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-6 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-indigo-700 hover:text-indigo-900 text-3xl font-bold z-50"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
