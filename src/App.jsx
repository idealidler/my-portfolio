import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RecruiterFriendly from './components/RecruiterFriendly';
import ActualAppContent from './components/ActualAppContent';

export default function App() {
  const [version, setVersion] = useState(null);

  if (!version) {
    return <LandingPage onSelect={setVersion} />;
  }

  if (version === 'recruiter') {
    return <RecruiterFriendly switchVersion={() => setVersion('hiringManager')} />;
  }

  return <ActualAppContent switchVersion={() => setVersion('recruiter')} />;
}
