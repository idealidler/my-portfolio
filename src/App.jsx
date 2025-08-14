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
        switchVersion={setVersion} // Pass setVersion directly
      />
    );
  }

  if (version === 'hiringManager') {
    return (
      <HiringManagerApp
        switchVersion={setVersion} // Pass setVersion directly
      />
    );
  }

  if (version === 'AkshayGPT') {
    return (
      <AkshayGPT
        switchVersion={setVersion} // Pass setVersion directly
      />
    );
  }

  return null;
}
