import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { inviteCodeService, InviteCode } from '../../services/invite-code.service';

const CohortDetailsScreen = ({ route }: any) => {
  const cohortId = route?.params?.cohortId || 'mock-cohort-id';
  const cohortName = route?.params?.cohortName || 'Mock Cohort';
  
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const code = await inviteCodeService.generateInviteCode(cohortId, {});
      setInviteCode(code);
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not generate invite code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode.code);
      Alert.alert('Success', 'Invite code copied to clipboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cohortName}</Text>
      <Text style={styles.subtitle}>ID: {cohortId}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGenerateCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Invite Code</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Code Generated!</Text>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{inviteCode?.code}</Text>
            </View>

            <Text style={styles.modalDetail}>
              Expires: {inviteCode ? new Date(inviteCode.expiryDate).toLocaleDateString() : ''}
            </Text>
            <Text style={styles.modalDetail}>
              Usage: {inviteCode?.usedCount} / {inviteCode?.maxUsage}
            </Text>

            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  codeContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e7d32',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#1b5e20',
  },
  modalDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  copyButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default CohortDetailsScreen;
