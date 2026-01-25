import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CompanyMedicine {
  name: string;
  mrp: number;
}

interface CompanyCardProps {
  companyName: string;
  medicines: CompanyMedicine[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CompanyCard({ 
  companyName, 
  medicines, 
  onEdit, 
  onDelete 
}: CompanyCardProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} activeOpacity={0.95} disabled={!onEdit}>
        <View style={styles.headerRow}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyName}</Text>
          </View>
          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.medicinesContainer}>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineRow}>
              <Text style={styles.medicineName} numberOfLines={1}>
                {medicine.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{medicine.mrp}</Text>
              </View>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {onDelete && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyInfo: { flex: 1 },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  editButtonText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  medicinesContainer: {
    gap: 12,
  },
  medicineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  medicineName: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  priceContainer: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14,165,233,0.2)',
  },
  price: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
});
