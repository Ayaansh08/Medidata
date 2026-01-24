import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PatientCardProps {
  name: string;
  phone: string;
  date: string;
  medicines: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PatientCard({ 
  name, 
  phone, 
  date, 
  medicines, 
  onEdit, 
  onDelete 
}: PatientCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Parse medicines with optional quantity
  const parseMedicine = (med: string) => {
    const trimmed = med.trim();
    
    const xPattern = /^(.+?)\s*[xX](\d+)$/;
    const xMatch = trimmed.match(xPattern);
    if (xMatch) {
      return { name: xMatch[1].trim(), quantity: xMatch[2] };
    }
    
    const dashPattern = /^(.+?)\s*-\s*(\d+)\s*(tablets?|pills?|caps?|capsules?)?$/i;
    const dashMatch = trimmed.match(dashPattern);
    if (dashMatch) {
      return { name: dashMatch[1].trim(), quantity: dashMatch[2] };
    }
    
    return { name: trimmed, quantity: null };
  };

  const medicineList = medicines
    .split(',')
    .map((med) => parseMedicine(med))
    .filter((med) => med.name.length > 0);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} activeOpacity={0.95}>
        <View style={styles.headerRow}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{name}</Text>
            <Text style={styles.phoneNumber}>{phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.purchaseDate}>{formatDate(date)}</Text>
        
        <View style={styles.medicinesContainer}>
          {medicineList.map((medicine, index) => (
            <View key={index} style={styles.medicineChip}>
              <Text style={styles.medicineText}>{medicine.name}</Text>
              {medicine.quantity && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>×{medicine.quantity}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>
      
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6C757D',
    fontFamily: 'monospace', // Makes phone numbers look cleaner
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
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0EBFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medicineText: {
    fontSize: 13,
    color: '#1971C2',
    fontWeight: '500',
  },
  quantityBadge: {
    backgroundColor: '#1971C2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 28,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
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
