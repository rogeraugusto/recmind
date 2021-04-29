import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

interface HeaderRefs {
  micAllowed: boolean;
}

export const Container = styled.View`
  flex: 1;

  flex-direction: column;
  align-items: center;
  background-color: #000;
`;

export const Content = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 30px 0px 20px 0px;
`;

export const Header = styled.View<HeaderRefs>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #212121;
  opacity: 1;

  ${(props) => (props.micAllowed ? 'opacity: 0;' : '')}
`;

export const TextHeader = styled.Text`
  color: #fff;
  font-family: 'youtube-sans-bold';
  font-size: 20px;
`;

export const Title = styled.Text`
  color: #fff;
  font-family: 'youtube-sans-bold';
  font-size: 50px;
`;

export const MicAnimation = styled(LottieView)`
  width: 280px;
  margin-top: 15px;
  background-color: red;
`;

export const RecAudioPermission = styled(LottieView)`
  width: 50px;
`;

export const ResultsContainer = styled.View`
  width: 100%;
  margin: 20px 10px 10px 10px;
  align-items: center;
`;

export const TextResults = styled.Text`
  color: #fff;
  font-family: 'youtube-sans-bold';
  font-size: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
`;
