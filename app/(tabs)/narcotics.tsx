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

import NarcoticsCard from '../../components/NarcoticsCard';
import SearchBar from '../../components/SearchBar';
import AddButton from '../../components/AddButton';
import AddNarcoticsModal from '../../components/AddNarcoticsModal';
import { apiService, Narcotic, Medicine } from '../../services/api';

function NarcoticsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [narcotics, setNarcotics] = useState<Narcotic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNarcotic, setEditingNarcotic] = useState<Narcotic | null>(null);

  const fetchNarcotics = useCallback(async () => {
    setLoading(true);
    const fetchedNarcotics = await apiService.getNarcotics();
    setNarcotics(fetchedNarcotics);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNarcotics();
  }, [fetchNarcotics]);

  const filteredNarcotics = narcotics
    .filter((record) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        record.name.toLowerCase().includes(lowerQuery) ||
        (record.phone && record.phone.toLowerCase().includes(lowerQuery))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

  const handleAddPress = () => {
    setEditingNarcotic(null);
    setModalVisible(true);
  };

  const handleEditPress = (record: Narcotic) => {
    setEditingNarcotic(record);
    setModalVisible(true);
  };

  const handleSaveNarcotic = async (
    name: string,
    phone: string,
    purchase_date: string,
    medicines: Medicine[]
  ) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const success = editingNarcotic
        ? await apiService.updateNarcotic(editingNarcotic.id, {
            name,
            phone,
            purchase_date,
            medicines,
          })
        : await apiService.addNarcotic({
            name,
            phone,
            purchase_date,
            medicines,
          });

      if (success) {
        await fetchNarcotics();
        setModalVisible(false);
        setEditingNarcotic(null);
      } else {
        Alert.alert('Error', 'Failed to save narcotic record. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save narcotic record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingNarcotic(null);
  };

  const handleDeleteNarcotic = (id: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this narcotic record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await apiService.deleteNarcotic(id);
              if (success) {
                await fetchNarcotics();
              } else {
                Alert.alert('Error', 'Failed to delete record');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  };

  const renderNarcoticsCard = ({ item }: { item: Narcotic }) => (
    <NarcoticsCard
      name={item.name}
      phone={item.phone}
      purchaseDate={item.purchase_date}
      medicines={item.medicines}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeleteNarcotic(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#212529" />
        <Text style={styles.loadingText}>Loading narcotics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Narcotics</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredNarcotics}
        keyExtractor={(item) => item.id}
        renderItem={renderNarcoticsCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No records match your search'
                : 'No narcotic records found'}
            </Text>
            {!searchQuery ? (
              <Text style={styles.emptySubtext}>
                Tap + to add your first record
              </Text>
            ) : null}
          </View>
        }
      />

      <AddButton onPress={handleAddPress} />

      <AddNarcoticsModal
        visible={modalVisible}
        onSave={handleSaveNarcotic}
        onCancel={handleCancel}
        editingNarcotic={editingNarcotic}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

export default function NarcoticsScreen() {
  return <NarcoticsContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
