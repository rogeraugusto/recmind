import React from 'react';

import { VoiceRecognizingProvider } from './voiceRecognition';

const AppProvider: React.FC = ({ children }) => {
  return <VoiceRecognizingProvider>{children}</VoiceRecognizingProvider>;
};

export default AppProvider;
