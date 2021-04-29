import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import * as chrono from 'chrono-node';

import Voice, {
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechRecognizedEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';

interface RecognizingState {
  speeaching?: boolean;
  error?: string;
  results?: Array<string>;
  partialResults?: Array<string>;
}

interface VoiceRecognitionData {
  recognition: RecognizingState;
  recordAudioPermission: boolean;
  toggleRecognizing(): Promise<void>;
}

const VoiceRecognitionContext = createContext<VoiceRecognitionData>(
  {} as VoiceRecognitionData,
);

const VoiceRecognizingProvider: React.FC = ({ children }) => {
  const [recordAudioPermission, setRecordAudioPermission] = useState(false);
  const [recognition, setRecognitionData] = useState<RecognizingState>(
    {} as RecognizingState,
  );

  useEffect(() => {
    async function setupRecognition(): Promise<void> {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;

      if (Platform.OS === 'android') {
        try {
          setRecordAudioPermission(false);
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Permissão para gravar audio',
              message: 'Conceda permissão para gravar audio do seu dispositivo',
              buttonPositive: 'ok',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
              await Voice.destroy().then(Voice.removeAllListeners);
              setRecordAudioPermission(true);
              setRecognitionData({
                speeaching: false,
                error: '',
                results: [],
                partialResults: [],
              });
            } catch (e) {
              console.error(e);
            }
          } else {
            console.log('Permission denied');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
    }

    setupRecognition();
  }, []);

  const toggleRecognizing = useCallback(async () => {
    await Voice.stop();
    await Voice.start('en-EN');
    setRecognitionData({
      speeaching: false,
      error: '',
      results: [],
      partialResults: [],
    });
  }, []);

  const onSpeechStart = useCallback((e: SpeechStartEvent) => {
    console.log('onSpeechStart: ', e);
    setRecognitionData({ speeaching: true });
  }, []);

  const onSpeechRecognized = useCallback((e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
  }, []);

  const onSpeechEnd = useCallback(async (e: SpeechEndEvent) => {
    await Voice.stop();
    console.log('onSpeechEnd: ', e);
    setRecognitionData({ speeaching: false });
  }, []);

  const onSpeechError = useCallback((e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    setRecognitionData({
      speeaching: false,
      error: e.error?.code === '7' ? 'Please, try again' : e.error?.message,
    });
  }, []);

  const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
    setRecognitionData({
      speeaching: true,
      partialResults: e.value,
      error: '',
    });
  }, []);

  const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    const results = e.value;
    setRecognitionData({ speeaching: false, results, error: '' });

    if (results) {
      console.log('>> ', results);
      const parsedSpeach = chrono.en.parse(results[0]);
      console.log(JSON.stringify(parsedSpeach));
    }
  }, []);

  const value = React.useMemo(
    () => ({
      recordAudioPermission,
      toggleRecognizing,
      recognition,
    }),
    [recordAudioPermission, toggleRecognizing, recognition],
  );

  return (
    <VoiceRecognitionContext.Provider value={value}>
      {children}
    </VoiceRecognitionContext.Provider>
  );
};

function useRecognition(): VoiceRecognitionData {
  const context = useContext(VoiceRecognitionContext);

  if (!context) {
    throw new Error(`useRecognition must be used within a VoiceRecognizing`);
  }

  return context;
}

export { VoiceRecognizingProvider, useRecognition };
