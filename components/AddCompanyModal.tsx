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

// ✅ Export for CompaniesContent
export interface AddCompanyModalProps {
  visible: boolean;
  onSave: (companyName: string, medicines: { name: string; mrp: number }[]) => void;
  onCancel: () => void;
  editingCompany?: { companyName: string; medicines: { name: string; mrp: number }[] } | null;
  submitting?: boolean;
}

interface MedicineEntry {
  name: string;
  mrp: string;
}

export default function AddCompanyModal({
  visible,
  onSave,
  onCancel,
  editingCompany,
  submitting = false,
}: AddCompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [medicineEntries, setMedicineEntries] = useState<MedicineEntry[]>([
    { name: '', mrp: '' },
  ]);

  useEffect(() => {
    if (visible && editingCompany) {
      setCompanyName(editingCompany.companyName);
      setMedicineEntries(
        editingCompany.medicines.map((m) => ({
          name: m.name,
          mrp: String(m.mrp),
        }))
      );
    }

    if (visible && !editingCompany) {
      setCompanyName('');
      setMedicineEntries([{ name: '', mrp: '' }]);
    }
  }, [visible, editingCompany]);

  const addMedicineRow = () => {
    setMedicineEntries([...medicineEntries, { name: '', mrp: '' }]);
  };

  const removeMedicineRow = (index: number) => {
    if (medicineEntries.length > 1) {
      setMedicineEntries(medicineEntries.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: keyof MedicineEntry, value: string) => {
    const updated = [...medicineEntries];
    updated[index][field] = value;
    setMedicineEntries(updated);
  };

  const handleSave = () => {
    if (!companyName.trim()) return;

    const medicines = medicineEntries
      .filter((m) => m.name.trim())
      .map((m) => ({
        name: m.name.trim(),
        mrp: Number(m.mrp) || 0,
      }));

    if (medicines.length === 0) return;

    onSave(companyName.trim(), medicines);
  };

  const handleCancelLocal = () => {
    onCancel();
  };

  const modalTitle = editingCompany ? 'Edit Company' : 'Add Company';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancelLocal}>
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

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter company name"
                      value={companyName}
                      onChangeText={setCompanyName}
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Medicines</Text>
                      <TouchableOpacity onPress={addMedicineRow} disabled={submitting}>
                        <Text style={styles.addMedicineButton}>+ Add More</Text>
                      </TouchableOpacity>
                    </View>

                    {medicineEntries.map((entry, index) => (
                      <View key={index} style={styles.medicineRow}>
                        <TextInput
                          style={[styles.input, styles.medicineNameInput]}
                          placeholder="Medicine name"
                          value={entry.name}
                          onChangeText={(v) => updateMedicine(index, 'name', v)}
                          editable={!submitting}
                        />
                        <TextInput
                          style={[styles.input, styles.mrpInput]}
                          placeholder="MRP"
                          value={entry.mrp}
                          onChangeText={(v) => updateMedicine(index, 'mrp', v)}
                          keyboardType="number-pad"
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
                          : editingCompany
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
  mrpInput: { width: 80 },
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
