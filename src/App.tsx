import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';

import AppContainer from './hooks';
import Routes from './routes';

const App: React.FC = () => (
  <AppContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <Routes />
  </AppContainer>
);

export default App;
