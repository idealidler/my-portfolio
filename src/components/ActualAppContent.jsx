import React, { useState } from "react";
import RecruiterFriendly from "./RecruiterFriendly";
import HiringManagerApp from "./HiringManagerApp";

export default function ActualAppContent() {
  // Track which version is active
  const [mode, setMode] = useState("hiringManager"); // default to hiring manager

  // Pass setMode to child so they can switch
  return (
    <div>
      {mode === "recruiter" ? (
        <RecruiterFriendly setMode={setMode} />
      ) : (
        <HiringManagerApp setMode={setMode} />
      )}
    </div>
  );
}
