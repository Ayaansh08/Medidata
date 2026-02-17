import React, { useMemo, useState } from 'react';
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
  onDelete,
}: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedMedicines = useMemo(
    () => [...medicines].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
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
            {companyName}
          </Text>
          <Text style={styles.summaryMeta}>{sortedMedicines.length} medicines</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '^' : 'v'}</Text>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.expandedContent}>
          <View style={styles.medicinesContainer}>
            {sortedMedicines.map((medicine, index) => (
              <View key={`${medicine.name}-${index}`} style={styles.medicineRow}>
                <Text style={styles.medicineName} numberOfLines={1}>
                  {medicine.name}
                </Text>
                <Text style={styles.medicineMeta}>Rs {medicine.mrp}</Text>
              </View>
            ))}
          </View>

          {(onEdit || onDelete) ? (
            <View style={styles.actionButtons}>
              {onEdit ? (
                <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.8}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : null}
              {onDelete ? (
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.8}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
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
  summaryMeta: {
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
  medicinesContainer: {
    gap: 8,
    marginTop: 10,
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
    color: '#075985',
    fontWeight: '700',
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
