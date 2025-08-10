import React from 'react';

export default function ContactSection() {
  return (
    <section id="contact" className="mb-16">
      <div className="mb-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 w-full">
          <h2 className="text-4xl font-bold text-indigo-700 mb-4">Contact</h2>
          <p className="text-gray-600 mb-8">
            If you'd like to discuss a role or project, email me or schedule a quick call.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12H8m8-4H8m-2 8h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="font-semibold">Email</h4>
              </div>
              <a
                href="mailto:akshayjain128@gmail.com"
                className="text-indigo-600 hover:underline break-all"
              >
                akshayjain128@gmail.com
              </a>
            </div>

            {/* Availability */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7 6h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="font-semibold">Availability</h4>
              </div>
              <p className="text-gray-600">
                Open to full-time roles. Available for interviews.<br />Mornings ET preferred.
              </p>
            </div>

            {/* Schedule a Call */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7 6h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="font-semibold">Schedule a Call</h4>
              </div>
              <a
                href="https://calendly.com/akshayjain128/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
              >
                Book 30-min Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
