// Import React hooks and all the necessary page components.
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RecruiterFriendly from './components/RecruiterFriendly';
import HiringManagerApp from './components/HiringManagerApp';
import AkshayGPTLanding from './components/AkshayGPTLanding';
import AkshayGPTChat from './components/AkshayGPTChat';

/**
 * This is the main component that acts as a router for the entire application.
 * It uses state to conditionally render different pages based on user selection.
 */
export default function App() {
  // 'version' state determines which main section of the portfolio is shown.
  // It starts as 'null' to show the initial landing page.
  const [version, setVersion] = useState(null);

  // 'subPage' state manages navigation *within* the 'AkshayGPT' version.
  // It toggles between the 'landing' page and the 'chat' interface.
  const [subPage, setSubPage] = useState('landing');

  // 'initialQuestion' state passes a pre-selected question from the
  // AkshayGPT landing page directly to the chat component.
  const [initialQuestion, setInitialQuestion] = useState('');

  // Handler function to switch to the AkshayGPT chat view.
  const switchToChat = () => setSubPage('chat');

  // Handler function to switch back to the AkshayGPT landing view.
  // It also clears any initial question to ensure a clean state.
  const switchToLanding = () => {
    setSubPage('landing');
    setInitialQuestion('');
  };

  // If no version is selected yet, show the main landing page.
  if (!version) {
    return <LandingPage onSelect={setVersion} />;
  }

  // If the user selects the 'recruiter' version, show that component.
  if (version === 'recruiter') {
    return <RecruiterFriendly switchVersion={setVersion} />;
  }

  // If the user selects the 'hiringManager' version, show that component.
  if (version === 'hiringManager') {
    return <HiringManagerApp switchVersion={setVersion} />;
  }

  // If the user selects the 'AkshayGPT' version, use the 'subPage' state
  // to determine whether to show the landing or chat component.
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

  // A fallback that returns nothing if no conditions are met.
  return null;
}