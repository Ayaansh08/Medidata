import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine } from '../services/api';

interface NarcoticsCardProps {
  name: string;
  phone: string;
  purchaseDate: string;
  medicines: Medicine[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function NarcoticsCard({
  name,
  phone,
  purchaseDate,
  medicines,
  onEdit,
  onDelete,
}: NarcoticsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const totalQty = useMemo(
    () => medicines.reduce((sum, medicine) => sum + (Number(medicine.qty) || 0), 0),
    [medicines]
  );

  const totalPrice = useMemo(
    () =>
      medicines.reduce(
        (sum, medicine) =>
          sum + (Number(medicine.price) || 0) * (Number(medicine.qty) || 0),
        0
      ),
    [medicines]
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.summaryRow}
        activeOpacity={0.9}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <View style={styles.summaryMain}>
          <Text style={styles.summaryName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.summaryDate}>{formatDate(purchaseDate)}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '^' : 'v'}</Text>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.expandedContent}>
          {phone ? <Text style={styles.phoneNumber}>Phone: {phone}</Text> : null}

          <View style={styles.medicinesContainer}>
            {medicines.map((medicine, index) => (
              <View key={`${medicine.name}-${index}`} style={styles.medicineRow}>
                <Text style={styles.medicineName} numberOfLines={1}>
                  {medicine.name}
                </Text>
                <Text style={styles.medicineMeta}>
                  Qty {medicine.qty} - Rs {medicine.price}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              Qty {totalQty} - Rs {totalPrice}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.8}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.8}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  summaryRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMain: {
    flex: 1,
  },
  summaryName: {
    fontSize: 17,
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  summaryDate: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 10,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '800',
  },
  expandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  phoneNumber: {
    fontSize: 13,
    color: '#475569',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  medicinesContainer: {
    gap: 8,
  },
  medicineRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  medicineName: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  medicineMeta: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  editButton: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 13,
    color: '#075985',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 13,
    color: '#BE123C',
    fontWeight: '700',
  },
});
