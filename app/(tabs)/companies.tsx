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
import CompanyCard from '../../components/CompanyCard';
import AddButton from '../../components/AddButton';
import AddCompanyModal, { AddCompanyModalProps } from '../../components/AddCompanyModal';
import { companyApi, Company } from '../../services/companyApi';

interface UICompany {
  id: string;
  companyName: string;
  medicines: { name: string; mrp: number }[];
}

interface UICompanyForModal {
  companyName: string;
  medicines: { name: string; mrp: number }[];
}

function CompaniesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<UICompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCompany, setEditingCompany] = useState<UICompanyForModal | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const data: Company[] = await companyApi.getCompanies();

    const mapped: UICompany[] = data.map((c) => ({
      id: c.id,
      companyName: c.company_name,
      medicines: c.medicines,
    }));

    setCompanies(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPress = () => {
    setEditingCompany(null);
    setModalVisible(true);
  };

  const handleEditPress = (company: UICompany) => {
    setEditingCompany({
      companyName: company.companyName,
      medicines: company.medicines,
    });
    setModalVisible(true);
  };

  const handleSaveCompany = async (companyName: string, medicines: { name: string; mrp: number }[]) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const apiCompany = {
        company_name: companyName,
        medicines,
      };

      const success = editingCompany
        ? await companyApi.updateCompany(
            companies.find((c) => c.companyName === editingCompany.companyName)?.id || '',
            apiCompany
          )
        : await companyApi.addCompany(apiCompany);

      if (success) {
        await fetchCompanies();
        setModalVisible(false);
        setEditingCompany(null);
      } else {
        Alert.alert('Error', 'Failed to save company. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCompany(null);
  };

  const handleDeleteCompany = (companyId: string) => {
    Alert.alert(
      'Delete Company',
      'Are you sure you want to delete this company record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await companyApi.deleteCompany(companyId);
              if (success) {
                await fetchCompanies(); // ✅ Working delete
              } else {
                Alert.alert('Error', 'Failed to delete company.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete company.');
            }
          },
        },
      ]
    );
  };

  const renderCompanyCard = ({ item }: { item: UICompany }) => (
    <CompanyCard
      companyName={item.companyName}
      medicines={item.medicines}
      onEdit={() => handleEditPress(item)}
      onDelete={() => handleDeleteCompany(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#212529" />
        <Text style={styles.loadingText}>Loading companies...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Companies</Text>
      </View>

      <View style={styles.searchContainer}>
        {/* ✅ FIXED: Proper placeholder for Companies */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
           
        />
      </View>

      <FlatList
        data={filteredCompanies}
        keyExtractor={(item) => item.id}
        renderItem={renderCompanyCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No companies match your search'
                : 'No company records found'}
            </Text>
            {!searchQuery && (
              <Text style={styles.emptySubtext}>
                Tap + to add your first company
              </Text>
            )}
          </View>
        }
      />

      <AddButton onPress={handleAddPress} />
      
      <AddCompanyModal
        visible={modalVisible}
        onSave={handleSaveCompany}
        onCancel={handleCancel}
        editingCompany={editingCompany}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

export default CompaniesContent;

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
