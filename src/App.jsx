import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RecruiterFriendly from './components/RecruiterFriendly';
import HiringManagerApp from './components/HiringManagerApp';
import AkshayGPT from './components/AkshayGPT';

export default function App() {
  const [version, setVersion] = useState(null);

  if (!version) {
    return <LandingPage onSelect={setVersion} />;
  }

  if (version === 'recruiter') {
    return (
      <RecruiterFriendly
        switchVersion={() => setVersion('hiringManager')}
      />
    );
  }

  if (version === 'hiringManager') {
    return (
      <HiringManagerApp
        switchVersion={() => setVersion('recruiter')}
      />
    );
  }

  if (version === 'AkshayGPT') {
    return (
      <AkshayGPT
        switchVersion={setVersion} // Pass setVersion directly to allow flexible switching
      />
    );
  }

  return null; // Fallback
}