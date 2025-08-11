import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RecruiterFriendly from './components/RecruiterFriendly';
import HiringManagerApp from './components/HiringManagerApp';

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

  return null; // fallback
}
