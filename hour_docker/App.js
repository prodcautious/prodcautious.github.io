import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

let nextId = 0;

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        nextId = parsed.length > 0 ? Math.max(...parsed.map(s => s.id)) + 1 : 0;
      }
    };
    load();
  }, []);

  const deleteSession = async (id) => {
    const newSessions = sessions.filter((s) => s.id !== id);
    setSessions(newSessions);
    await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));
  };

  return (
    <View style={styles.backgroundContainer}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>HOURS</Text>
        <Text style={styles.headerTitle}>Dock Those Hours King!</Text>
      </View>

      {/* Sessions scroll container */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.itemContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Session Card */}
        <View style={styles.addSessionCard}>
          <Text style={styles.cardTitle}>New Session</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HOURS</Text>
              <TextInput
                style={styles.input}
                value={String(hours)}
                onChangeText={(val) => setHours(val)}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
                placeholder="0"
              />
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MINUTES</Text>
              <TextInput
                style={styles.input}
                value={String(minutes)}
                onChangeText={(val) => setMinutes(val)}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
                placeholder="0"
              />
            </View>
          </View>

          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={(val) => setDescription(val)}
            placeholderTextColor={COLORS.textSecondary}
            placeholder="What did you work on?"
            maxLength={60}
          />

          <Button title="+ Add Session" onPress={async () => {
            const h = parseInt(hours) || 0;
            const m = parseInt(minutes) || 0;

            if (h === 0 && m === 0) return setError('Please enter hours or minutes.');
            if (h > 24) return setError('Hours must be between 0 and 24.');
            if (m > 59) return setError('Minutes must be between 0 and 59.');

            setError('');

            const newSessions = [...sessions, {
              id: nextId++,
              hours: h,
              minutes: m,
              description: description.trim() || 'No description',
            }];

            setSessions(newSessions);
            await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));

            console.log(`Adding session: ${h} hours and ${m} minutes`);
            setHours('');
            setMinutes('');
            setDescription('');
          }} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionContainer}>
            <View style={styles.sessionAccent} />
            <View style={styles.sessionContent}>
              <Text style={styles.sessionTitle}>Session {session.id + 1}</Text>
              <Text style={styles.sessionMeta}>{session.description}</Text>
            </View>
            <Text style={styles.sessionTime}>{session.hours}h {session.minutes}m</Text>
            <Pressable onPress={() => deleteSession(session.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </Pressable>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const COLORS = {
  bg: '#0a0c12',
  surface: '#13151f',
  surfaceHighlight: '#1c1f2e',
  border: '#222536',
  accent: '#f5a623',
  textPrimary: '#e8eaf0',
  textSecondary: '#555870',
  danger: '#e05c5c',
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerEyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: COLORS.accent,
    fontWeight: '800',
    marginBottom: 6,
    opacity: 0.8,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },

  scrollView: {
    flex: 1,
  },

  itemContainer: {
    padding: 20,
    gap: 16,
  },

  addSessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    gap: 16,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  inputGroup: {
    flex: 1,
    gap: 6,
  },

  inputLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  input: {
    backgroundColor: COLORS.surfaceHighlight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  descriptionInput: {
    backgroundColor: COLORS.surfaceHighlight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  inputDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginTop: 18,
  },

  sessionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 80,
  },

  sessionAccent: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.accent,
  },

  sessionContent: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 4,
  },

  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },

  sessionMeta: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },

  sessionTime: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
    paddingRight: 18,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },

  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 4,
  },

  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },

  errorText: {
    color: '#e05c5c',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});