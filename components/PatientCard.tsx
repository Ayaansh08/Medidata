import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine } from '../services/api';

interface PatientCardProps {
  name: string;
  phone: string;
  purchaseDate: string; 
  medicines: Medicine[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function PatientCard({
  name,
  phone,
  purchaseDate,
  medicines,
  onEdit,
  onDelete,
}: PatientCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ✅ FIXED: Use existing Medicine properties (price, not mrp)
  const totalPrice = medicines.reduce((sum, m) => sum + m.price, 0);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} activeOpacity={0.95}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{name}</Text>
            {phone ? <Text style={styles.phoneNumber}>{phone}</Text> : null}
          </View>

          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.purchaseDate}>
          {formatDate(purchaseDate)}
        </Text>

        {/* Medicines - Show price only */}
        <View style={styles.medicinesContainer}>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineChip}>
              <Text style={styles.medicineText}>
                {medicine.name}
              </Text>

              {/* ✅ FIXED: Use medicine.price (existing property) */}
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  ₹{medicine.price}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Price */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalAmount}>₹{totalPrice}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardContent: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: { flex: 1 },
  patientName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6C757D',
    fontFamily: 'monospace',
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
  purchaseDate: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 14,
  },
  medicinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  medicineChip: {
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0EBFF',
  },
  medicineText: {
    fontSize: 13,
    color: '#1971C2',
    fontWeight: '500',
    marginBottom: 2,
  },
  // ✅ FIXED: Price display (uses existing medicine.price)
  priceRow: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 12,
    color: '#0B7285',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 18,
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
