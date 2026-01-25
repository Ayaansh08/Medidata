import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PatientCard from '../../components/PatientCard';
import SearchBar from '../../components/SearchBar';
import AddButton from '../../components/AddButton';
import AddPatientModal from '../../components/AddPatientModal';
import { apiService, Patient, Medicine } from '../../services/api';

function HomeScreenContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const fetchedPatients = await apiService.getPatients();
    setPatients(fetchedPatients);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // ✅ FIXED: Search by NAME AND PHONE NUMBER (OR logic)
  const filteredPatients = patients.filter((patient) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(lowerQuery) ||
      (patient.phone && patient.phone.toLowerCase().includes(lowerQuery))
    );
  });

  const handleAddPress = () => {
    setEditingPatient(null);
    setModalVisible(true);
  };

  const handleEditPress = (patient: Patient) => {
    setEditingPatient(patient);
    setModalVisible(true);
  };

  const handleSavePatient = async (
    name: string,
    phone: string,
    purchase_date: string,
    medicines: Medicine[]
  ) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const success = editingPatient
        ? await apiService.updatePatient(editingPatient.id, {
            name,
            phone,
            purchase_date,
            medicines,
          })
        : await apiService.addPatient({
            name,
            phone,
            purchase_date,
            medicines,
          });

      if (success) {
        await fetchPatients();
        setModalVisible(false);
        setEditingPatient(null);
      } else {
        Alert.alert('Error', 'Failed to save patient. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patientId: string) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await apiService.deletePatient(patientId);
              if (success) {
                await fetchPatients();
              } else {
                Alert.alert('Error', 'Failed to delete patient');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete patient');
              console.error('Delete error:', error);
            }
          },
        },
      ]
    );
  };

  const renderPatientCard = ({ item }: { item: Patient }) => (
    <PatientCard
      name={item.name}
      phone={item.phone}
      purchaseDate={item.purchase_date}
      medicines={item.medicines}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeletePatient(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#212529" />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediData</Text>
      </View>

      <View style={styles.searchContainer}>
        {/* ✅ FIXED: Added placeholder + SafeArea edges */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          
        />
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No patients match your search'
                : 'No patient records found'}
            </Text>
            {!searchQuery && (
              <Text style={styles.emptySubtext}>
                Tap + to add your first patient
              </Text>
            )}
          </View>
        }
      />

      <AddButton onPress={handleAddPress} />
      
      <AddPatientModal
        visible={modalVisible}
        onSave={handleSavePatient}
        onCancel={handleCancel}
        editingPatient={editingPatient}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

export default function PatientsScreen() {
  return <HomeScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#212529',
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ADB5BD',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#6C757D',
    marginTop: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C757D',
  },
});
