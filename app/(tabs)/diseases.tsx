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
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../../components/SearchBar';
import DiseaseCard from '../../components/DiseaseCard';
import AddButton from '../../components/AddButton';
import AddDiseaseModal from '../../components/AddDiseaseModal';
import { diseaseApi, Disease } from '../../services/diseaseApi';

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

  const filteredDiseases = diseases
    .filter((disease) => disease.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.diseaseName.localeCompare(b.diseaseName, 'en', { sensitivity: 'base' }));

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
        medicines: medicines.map((name) => ({ name, qty: 1 })),
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
                await fetchDiseases();
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
        <ActivityIndicator size="large" color="#0F172A" />
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
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
              {searchQuery ? 'No diseases match your search' : 'No disease records found'}
            </Text>
            {!searchQuery ? (
              <Text style={styles.emptySubtext}>Tap + to add your first disease</Text>
            ) : null}
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
    backgroundColor: '#F1F5F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F1F5F9',
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.7,
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  emptyContainer: {
    paddingTop: 72,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748B',
  },
});
