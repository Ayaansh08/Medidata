import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

// ✅ FIXED: Export type for DiseasesContent
export interface AddDiseaseModalProps {
  visible: boolean;
  onSave: (diseaseName: string, medicines: string[]) => void;
  onCancel: () => void;
  editingDisease?: { diseaseName: string; medicines: string[] } | null;
  submitting?: boolean;
}

interface MedicineEntry {
  name: string;
}

export default function AddDiseaseModal({
  visible,
  onSave,
  onCancel,
  editingDisease,
  submitting = false,
}: AddDiseaseModalProps) {
  const [diseaseName, setDiseaseName] = useState('');
  const [medicineEntries, setMedicineEntries] = useState<MedicineEntry[]>([
    { name: '' },
  ]);

  // Populate form when editing
  useEffect(() => {
    if (visible && editingDisease) {
      setDiseaseName(editingDisease.diseaseName);
      setMedicineEntries(
        editingDisease.medicines.map((med) => ({ name: med }))
      );
    }

    if (visible && !editingDisease) {
      setDiseaseName('');
      setMedicineEntries([{ name: '' }]);
    }
  }, [visible, editingDisease]);

  // Helpers
  const addMedicineRow = () => {
    setMedicineEntries([...medicineEntries, { name: '' }]);
  };

  const removeMedicineRow = (index: number) => {
    if (medicineEntries.length > 1) {
      setMedicineEntries(medicineEntries.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, value: string) => {
    const updated = [...medicineEntries];
    updated[index].name = value;
    setMedicineEntries(updated);
  };

  // Save
  const handleSave = () => {
    if (!diseaseName.trim()) return;

    const medicines: string[] = medicineEntries
      .filter((m) => m.name.trim())
      .map((m) => m.name.trim());

    if (medicines.length === 0) return;

    onSave(diseaseName.trim(), medicines);
  };

  const handleCancelLocal = () => {
    onCancel();
  };

  const modalTitle = editingDisease ? 'Edit Disease' : 'Add Disease';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelLocal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={handleCancelLocal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{modalTitle}</Text>

                  {/* Disease Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Disease Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter disease name"
                      value={diseaseName}
                      onChangeText={setDiseaseName}
                      editable={!submitting}
                    />
                  </View>

                  {/* Medicines */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Medicines</Text>
                      <TouchableOpacity
                        onPress={addMedicineRow}
                        disabled={submitting}
                      >
                        <Text style={styles.addMedicineButton}>+ Add More</Text>
                      </TouchableOpacity>
                    </View>

                    {medicineEntries.map((entry, index) => (
                      <View key={index} style={styles.medicineRow}>
                        <TextInput
                          style={[styles.input, styles.medicineNameInput]}
                          placeholder="Medicine name"
                          value={entry.name}
                          onChangeText={(v) => updateMedicine(index, v)}
                          editable={!submitting}
                        />
                        {medicineEntries.length > 1 && (
                          <TouchableOpacity
                            onPress={() => removeMedicineRow(index)}
                            style={styles.removeButton}
                            disabled={submitting}
                          >
                            <Text style={styles.removeButtonText}>×</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Actions */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.cancelButton,
                        submitting && styles.disabledButton,
                      ]}
                      onPress={handleCancelLocal}
                      disabled={submitting}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.saveButton,
                        submitting && styles.disabledButton,
                      ]}
                      onPress={handleSave}
                      disabled={submitting}
                    >
                      <Text style={styles.saveButtonText}>
                        {submitting
                          ? 'Saving...'
                          : editingDisease
                          ? 'Update'
                          : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ✅ Styles unchanged - perfect
const styles = StyleSheet.create({
  modalOverlay: { flex: 1 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addMedicineButton: {
    fontSize: 13,
    color: '#1971C2',
    fontWeight: '600',
  },
  input: {
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  medicineRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  medicineNameInput: { flex: 1 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 22,
    color: '#DC2626',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  saveButton: {
    backgroundColor: '#212529',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
