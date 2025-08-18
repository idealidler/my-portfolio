// src/components/sections/ContactSection.jsx

import React from 'react';
import { Mail, Calendar, Phone } from 'lucide-react';

/**
 * Renders the "Get In Touch" section.
 * Provides contact methods like email and a Calendly link for scheduling calls.
 */
export default function ContactSection() {
  return (
    <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-lg border border-slate-200/80">
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious team.
        Feel free to reach out via email or schedule a call.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        {/* Email */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
            <Mail size={24} />
          </div>
          <h4 className="font-semibold text-lg mb-1 text-gray-800">Email Me</h4>
          <a
            href="mailto:akshayjain128@gmail.com"
            className="text-indigo-600 hover:underline break-all"
          >
            akshayjain128@gmail.com
          </a>
        </div>

        {/* Schedule a Call */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
            <Calendar size={24} />
          </div>
          <h4 className="font-semibold text-lg mb-1 text-gray-800">Schedule a Call</h4>
          <a
            href="https://calendly.com/akshayjain128/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Book a 30-min Call
          </a>
        </div>
      </div>
    </div>
  );
}