import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RecruiterFriendly from './components/RecruiterFriendly';
import HiringManagerApp from './components/HiringManagerApp';
import AkshayGPTLanding from './components/AkshayGPTLanding';
import AkshayGPTChat from './components/AkshayGPTChat';

export default function App() {
  const [version, setVersion] = useState(null);
  const [subPage, setSubPage] = useState('landing'); // For AkshayGPT: 'landing' or 'chat'
  const [initialQuestion, setInitialQuestion] = useState('');

  const switchToChat = () => setSubPage('chat');
  const switchToLanding = () => {
    setSubPage('landing');
    setInitialQuestion('');
  };

  if (!version) {
    return <LandingPage onSelect={setVersion} />;
  }

  if (version === 'recruiter') {
    return <RecruiterFriendly switchVersion={setVersion} />;
  }

  if (version === 'hiringManager') {
    return <HiringManagerApp switchVersion={setVersion} />;
  }

  if (version === 'AkshayGPT') {
    return subPage === 'landing' ? (
      <AkshayGPTLanding
        switchToChat={switchToChat}
        setInitialQuestion={setInitialQuestion}
        switchVersion={setVersion}
      />
    ) : (
      <AkshayGPTChat
        switchToLanding={switchToLanding}
        initialQuestion={initialQuestion}
        switchVersion={setVersion}
      />
    );
  }

  return null;
}