import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DiseaseCardProps {
  diseaseName: string;
  medicines: { name: string }[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DiseaseCard({
  diseaseName,
  medicines,
  onEdit,
  onDelete,
}: DiseaseCardProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} activeOpacity={0.95} disabled={!onEdit}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.diseaseInfo}>
            <Text style={styles.diseaseName}>{diseaseName}</Text>
          </View>

          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Medicines */}
        <View style={styles.medicinesContainer}>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineChip}>
              <Text style={styles.medicineText}>{medicine.name}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {/* Actions */}
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
  diseaseInfo: { 
    flex: 1 
  },
  diseaseName: {
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  medicineChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
  },
  medicineText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
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
