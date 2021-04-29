import React, { useRef } from 'react';
import { Pressable, Text } from 'react-native';
import {
  Container,
  Content,
  Header,
  TextHeader,
  Title,
  MicAnimation,
  RecAudioPermission,
  ResultsContainer,
  TextResults,
} from './styles';

import { useRecognition } from '../../hooks/voiceRecognition';

import recorder from '../../assets/mic.json';
import soundWave from '../../assets/soundwave.json';
import allowmic from '../../assets/allowmic.json';

const Home: React.FC = () => {
  const {
    toggleRecognizing,
    recordAudioPermission,
    recognition,
  } = useRecognition();
  const micAnimated = useRef<any>(null);

  const playAnimation = async () => {
    micAnimated.current.play(0, 60);
    toggleRecognizing();
  };

  // const naturalTranscription = (): React.ReactElement => {
  //   const { results } = recognition;
  //   console.log(results);

  //   if (results) {
  //     const betterResult = parse(results[0]);
  //     console.log(betterResult);
  //   }

  //   return <Text>OK</Text>;
  // };

  return (
    <Container>
      <Header micAllowed={recordAudioPermission}>
        <TextHeader>I can't hear you, allow your mic</TextHeader>
        <RecAudioPermission
          source={allowmic}
          loop={true}
          autoPlay={true}
          speed={1.5}
        />
      </Header>
      <Content>
        <Title>
          {recognition.speeaching
            ? 'Listening...'
            : recognition.error !== ''
            ? recognition.error
            : 'Press to talk :)'}
        </Title>
        <Pressable onPress={() => playAnimation()}>
          <MicAnimation
            source={recorder}
            loop={recognition.speeaching}
            autoPlay={false}
            progress={0}
            speed={1.5}
            ref={micAnimated}
          />
        </Pressable>
        <ResultsContainer>
          <TextResults>{recognition.partialResults}</TextResults>
        </ResultsContainer>
      </Content>
    </Container>
  );
};

export default Home;
