import React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function InputBar({ value, onChange, onSubmit, isDisabled, placeholder = "Ask about Akshay here..." }) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-3xl flex items-center bg-white rounded-full shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300 mx-auto"
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 px-6 py-4 text-gray-700 bg-transparent focus:outline-none text-lg rounded-full"
        disabled={isDisabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={`p-4 text-white flex items-center justify-center transition-all duration-300 rounded-r-full ${
          isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        <PaperAirplaneIcon className="h-6 w-6 transform rotate-45 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}