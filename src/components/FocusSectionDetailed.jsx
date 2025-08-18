// src/components/FocusSectionDetailed.jsx

import React from 'react';

/**
 * A reusable modal component for displaying detailed content in a focused view.
 * It creates an overlay and a content container.
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {function} onClose - The function to call when the modal should be closed.
 */
export default function FocusSectionDetailed({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Allows closing the modal by clicking the background overlay
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 shadow-2xl p-8 sm:p-10"
        onClick={e => e.stopPropagation()} // Prevents the modal from closing when clicking inside the content area
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-indigo-700 transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}