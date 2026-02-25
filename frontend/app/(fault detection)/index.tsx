import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Audio } from 'expo-av';

import { CarVisualizer } from '../../components/CarVisualizer'; // NORMAL import, remove React.lazy

const POSITIONS = [
  { id: 'inside', label: '🚪 Inside', value: 'inside' as const },
  { id: 'front', label: '🚗 Front', value: 'front' as const },
  { id: 'behind', label: '🔙 Behind', value: 'behind' as const },
];

type Position = 'inside' | 'front' | 'behind';

export default function FaultDetection() {
  const [position, setPosition] = useState<Position>('inside');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Prepare audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    }).catch((err) => console.warn('Audio setup failed:', err));
  }, []);

  async function safeUnload(rec: Audio.Recording | null) {
    if (!rec) return;
    try {
      const status = await rec.getStatusAsync();
      if ((status as any).isRecording || !(status as any).isDoneRecording) {
        await rec.stopAndUnloadAsync();
      }
    } catch (e: any) {
      if (__DEV__) console.warn('safeUnload ignored error:', e?.message || e);
    }
  }

  async function startRecording() {
    if (Platform.OS === 'web') {
      Alert.alert('Not supported', 'Recording is not available on web.');
      return;
    }
    if (isRecording) return;

    try {
      await safeUnload(recording);
      setRecording(null);

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Audio recording permission not granted.');
        return;
      }

      const rec = new Audio.Recording();

      const RECORDING_OPTIONS = {
        isMeteringEnabled: true,
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      } as any;

      await rec.prepareToRecordAsync(RECORDING_OPTIONS);
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Error', 'Failed to start recording.');
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    if (!recording || !isRecording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', {
        uri: uri as string,
        type: 'audio/wav',
        name: 'recording.wav',
      } as any);
      formData.append('position', position);

      const BACKEND_URL = 'http://192.168.0.3:3001/upload';

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} ${text}`);
      }

      const result = await response.json();

      Alert.alert(
        'Prediction Result',
        `Fault: ${result.faultType || result.prediction}\nConfidence: ${result.confidence}`
      );
    } catch (err) {
      console.error('Stop/upload error:', err);
      Alert.alert(
        'Network/Upload Error',
        'Could not reach the backend. Check IP/port, server running, and devices on same Wi-Fi.'
      );
    } finally {
      await safeUnload(recording);
      setRecording(null);
      setIsUploading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Fault Detection System</Text>
        <Text style={styles.subtitle}>Select microphone position and record audio</Text>
      </View>

      {/* CarVisualizer */}
      <CarVisualizer position={position} />

      <View style={styles.positionSection}>
        <Text style={styles.sectionTitle}>Select Recording Position</Text>
        <View style={styles.chipRow}>
          {POSITIONS.map((pos) => {
            const selected = position === pos.value;
            return (
              <Pressable
                key={pos.id}
                onPress={() => setPosition(pos.value)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {pos.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.sectionTitle}>Recording Control</Text>
        <View style={styles.controlsRow}>
          <Pressable
            onPress={startRecording}
            disabled={isRecording || isUploading}
            style={({ pressed }) => [
              styles.actionBtn,
              (isRecording || isUploading) && styles.actionBtnDisabled,
              pressed && !(isRecording || isUploading) && styles.actionBtnPressed,
            ]}
          >
            <Text style={styles.actionBtnText}>
              {isRecording ? '🔴 Recording...' : '🎤 Start Recording'}
            </Text>
          </Pressable>

          <Pressable
            onPress={stopRecording}
            disabled={!isRecording || isUploading}
            style={({ pressed }) => [
              styles.actionBtn,
              (!isRecording || isUploading) && styles.actionBtnDisabled,
              pressed && isRecording && !isUploading && styles.actionBtnPressed,
            ]}
          >
            <Text style={styles.actionBtnText}>
              {isUploading ? '⏳ Uploading...' : '⏹️ Stop & Upload'}
            </Text>
          </Pressable>
        </View>

        {isUploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Processing audio...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  contentContainer: { paddingVertical: 20, paddingHorizontal: 16 },

  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0D47A1', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },

  positionSection: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  controlSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#0D47A1', marginBottom: 12 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#CFE3FF', backgroundColor: '#F3F7FF' },
  chipSelected: { backgroundColor: '#2196F3', borderColor: '#1976D2' },
  chipPressed: { opacity: 0.85 },
  chipText: { fontSize: 13, fontWeight: '700', color: '#0D47A1' },
  chipTextSelected: { color: '#fff' },

  controlsRow: { gap: 10 },
  actionBtn: { backgroundColor: '#2196F3', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  actionBtnDisabled: { backgroundColor: '#A7C9ED' },
  actionBtnPressed: { opacity: 0.9 },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#2196F3', fontWeight: '600' },
});
