import { BotMessageSquare, Briefcase, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-pink-200 to-white animate-gradient-x"></div>

      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/20"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 p-8 text-center"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 to-pink-500 bg-clip-text text-transparent mb-6">
          Choose Your Experience
        </h1>
        <p className="max-w-lg mx-auto mb-12 text-gray-800">
          Glad you’re here! Select the path that fits your needs, whether you want a high-level overview or a deep dive.
        </p>

        <div className="flex flex-col sm:flex-row gap-10 justify-center">
          {/* Recruiter Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect("recruiter")}
            className="w-64 p-6 rounded-3xl bg-white/60 backdrop-blur-md shadow-xl text-yellow-900 border border-yellow-200 hover:shadow-2xl transition"
          >
            <Briefcase size={32} className="mx-auto mb-3 text-yellow-600" />
            <span className="block text-lg font-semibold">Recruiter Friendly Experience</span>
            <small className="text-xs font-normal block mt-2 text-gray-700">
              Skills, Job availability, Work authorization, Education
            </small>
          </motion.button>

          {/* Hiring Manager Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect("hiringManager")}
            className="w-64 p-6 rounded-3xl bg-white/60 backdrop-blur-md shadow-xl text-indigo-900 border border-indigo-200 hover:shadow-2xl transition"
          >
            <FileText size={32} className="mx-auto mb-3 text-indigo-600" />
            <span className="block text-lg font-semibold">Hiring Manager Friendly Experience</span>
            <small className="text-xs font-normal block mt-2 text-gray-700">
              Detailed, Technical, Project-heavy experience
            </small>
          </motion.button>

          {/* Chatbot Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect("AkshayGPT")}
            className="w-64 p-6 rounded-3xl bg-white/60 backdrop-blur-md shadow-xl text-indigo-900 border border-indigo-200 hover:shadow-2xl transition"
          >
            <BotMessageSquare size={32} className="mx-auto mb-3 text-indigo-600" />
            <span className="block text-lg font-semibold">Akshay GPT</span>
            <small className="text-xs font-normal block mt-2 text-gray-700">
              Ask questions, get answers, and explore your experience interactively
            </small>
          </motion.button>
        </div>
        
      </motion.div>
    </div>
  );
}
