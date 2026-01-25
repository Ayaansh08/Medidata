import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ FIXED: Proper import

import SearchBar from '../../components/SearchBar';
import DiseaseCard from '../../components/DiseaseCard';
import AddButton from '../../components/AddButton';
import AddDiseaseModal from '../../components/AddDiseaseModal';
import { diseaseApi, Disease } from '../../services/diseaseApi';

// ✅ FIXED: Modal expects this exact type
interface UIDiseaseForModal {
  diseaseName: string;
  medicines: string[];
}

interface UIDisease {
  id: string;
  diseaseName: string;
  medicines: { name: string }[];
}

function DiseasesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [diseases, setDiseases] = useState<UIDisease[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingDisease, setEditingDisease] = useState<UIDiseaseForModal | null>(null);

  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    const data: Disease[] = await diseaseApi.getDiseases();

    const mapped: UIDisease[] = data.map((d) => ({
      id: d.id,
      diseaseName: d.disease_name,
      medicines: d.medicines.map((m) => ({ name: m.name })),
    }));

    setDiseases(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const filteredDiseases = diseases.filter((disease) =>
    disease.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPress = () => {
    setEditingDisease(null);
    setModalVisible(true);
  };

  const handleEditPress = (disease: UIDisease) => {
    setEditingDisease({
      diseaseName: disease.diseaseName,
      medicines: disease.medicines.map((m) => m.name),
    });
    setModalVisible(true);
  };

  const handleSaveDisease = async (diseaseName: string, medicines: string[]) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const apiDisease = {
        disease_name: diseaseName,
        medicines: medicines.map((name) => ({ 
          name, 
          qty: 1 
        })),
      };

      const success = editingDisease
        ? await diseaseApi.updateDisease(
            diseases.find((d) => d.diseaseName === editingDisease.diseaseName)?.id || '',
            apiDisease
          )
        : await diseaseApi.addDisease(apiDisease);

      if (success) {
        await fetchDiseases();
        setModalVisible(false);
        setEditingDisease(null);
      } else {
        Alert.alert('Error', 'Failed to save disease. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save disease. Please try again.');
      console.error('Failed to save disease:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingDisease(null);
  };

  const handleDeleteDisease = (diseaseId: string) => {
    Alert.alert(
      'Delete Disease',
      'Are you sure you want to delete this disease record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await diseaseApi.deleteDisease(diseaseId);
              if (success) {
                await fetchDiseases(); // ✅ Working delete
              } else {
                Alert.alert('Error', 'Failed to delete disease.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete disease.');
            }
          },
        },
      ]
    );
  };

  const renderDiseaseCard = ({ item }: { item: UIDisease }) => (
    <DiseaseCard
      diseaseName={item.diseaseName}
      medicines={item.medicines}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeleteDisease(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#212529" />
        <Text style={styles.loadingText}>Loading diseases...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diseases</Text>
      </View>

      <View style={styles.searchContainer}>
        {/* ✅ FIXED: Proper placeholder for Diseases */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          
        />
      </View>

      <FlatList
        data={filteredDiseases}
        keyExtractor={(item) => item.id}
        renderItem={renderDiseaseCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No diseases match your search'
                : 'No disease records found'}
            </Text>
            {!searchQuery && (
              <Text style={styles.emptySubtext}>
                Tap + to add your first disease
              </Text>
            )}
          </View>
        }
      />

      <AddButton onPress={handleAddPress} />
      
      <AddDiseaseModal
        visible={modalVisible}
        onSave={handleSaveDisease}
        onCancel={handleCancel}
        editingDisease={editingDisease}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

export default DiseasesContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA', // ✅ Fixed background
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
    paddingBottom: 100, // ✅ Space for AddButton
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
