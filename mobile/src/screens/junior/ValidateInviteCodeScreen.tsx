import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { inviteCodeService } from '../../services/invite-code.service';

const ValidateInviteCodeScreen = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleValidate = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    setLoading(true);
    setData(null);
    try {
      const result = await inviteCodeService.validateInviteCode(code.trim().toUpperCase());
      setData(result);
    } catch (error: any) {
      Alert.alert('Invalid Code', error.message || 'The invite code provided is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await inviteCodeService.joinCohort(code.trim().toUpperCase());
      Alert.alert(
        'Success!', 
        `You have successfully joined ${result.cohortName}.`,
        [{ text: 'OK', onPress: () => {
          setData(null);
          setCode('');
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not join cohort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Join a Cohort</Text>
          <Text style={styles.subtitle}>Enter your invite code to join your group.</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g. ABCD1234"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={12}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleValidate}
            disabled={loading}
          >
            {loading && !data ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Validate Code</Text>
            )}
          </TouchableOpacity>
        </View>

        {data && (
          <View style={styles.cohortCard}>
            <Text style={styles.cohortLabel}>Success! You can join:</Text>
            <Text style={styles.cohortName}>{data.cohort.name}</Text>
            {data.cohort.description && (
              <Text style={styles.cohortDescription}>{data.cohort.description}</Text>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expires:</Text>
              <Text style={styles.infoValue}>{new Date(data.inviteCode.expiryDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Usage:</Text>
              <Text style={styles.infoValue}>{data.inviteCode.usedCount} / {data.inviteCode.maxUsage} slots filled</Text>
            </View>

            <TouchableOpacity 
              style={styles.joinButton}
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.joinButtonText}>Confirm & Join</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cohortCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    alignItems: 'center',
  },
  cohortLabel: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 8,
  },
  cohortName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 8,
  },
  cohortDescription: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  joinButton: {
    backgroundColor: '#1b5e20',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ValidateInviteCodeScreen;
