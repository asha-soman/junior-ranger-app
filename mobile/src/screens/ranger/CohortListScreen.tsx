import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { inviteCodeService, Cohort } from '../../services/invite-code.service';
import { Ionicons } from '@expo/vector-icons';

const CohortListScreen = ({ navigation }: any) => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCohorts = async () => {
    try {
      const data = await inviteCodeService.getCohorts();
      setCohorts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCohorts();
  };

  const renderItem = ({ item }: { item: Cohort }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('CohortDetails', { 
        cohortId: item.id, 
        cohortName: item.name 
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={24} color="#2e7d32" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cohortName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.cohortDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cohorts</Text>
      <Text style={styles.subtitle}>Select a cohort to generate an invite code.</Text>
      
      <FlatList
        data={cohorts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No cohorts found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cohortName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cohortDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default CohortListScreen;
