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
import { Patient } from '../services/api'; // ✅ Import Patient from api

interface AddPatientModalProps {
  visible: boolean;
  onSave: (name: string, phone: string, date: string, medicines: string) => void;
  onCancel: () => void;
  editingPatient: Patient | null;
  submitting?: boolean; // ✅ FIXED: Added optional submitting prop
}

interface MedicineEntry {
  name: string;
  quantity: string;
}

export default function AddPatientModal({
  visible,
  onSave,
  onCancel,
  editingPatient,
  submitting = false, // ✅ Default value
}: AddPatientModalProps) {
  // ... rest of your existing code stays EXACTLY the same ...

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [medicineEntries, setMedicineEntries] = useState<MedicineEntry[]>([
    { name: '', quantity: '' },
  ]);

  // Populate form when editing
  useEffect(() => {
    if (visible && editingPatient) {
      setName(editingPatient.name);
      setPhone(editingPatient.phone);
      setDate(editingPatient.date);
      
      const parsedMedicines = editingPatient.medicines
        .split(',')
        .map((med) => {
          const trimmed = med.trim();
          const xMatch = trimmed.match(/^(.+?)\s*[xX](\d+)$/);
          if (xMatch) {
            return { name: xMatch[1].trim(), quantity: xMatch[2] };
          }
          return { name: trimmed, quantity: '' };
        })
        .filter((m) => m.name);
      
      setMedicineEntries(parsedMedicines.length ? parsedMedicines : [{ name: '', quantity: '' }]);
    } else {
      setName('');
      setPhone('');
      setDate('');
      setMedicineEntries([{ name: '', quantity: '' }]);
    }
  }, [visible, editingPatient]);

  const handleSave = () => {
    if (name.trim() && phone.trim() && date.trim() && medicineEntries.some(m => m.name.trim())) {
      const medicinesString = medicineEntries
        .filter(m => m.name.trim())
        .map(m => {
          const medName = m.name.trim();
          const qty = m.quantity.trim();
          return qty ? `${medName} x${qty}` : medName;
        })
        .join(', ');

      onSave(name.trim(), phone.trim(), date.trim(), medicinesString);
    }
  };

  const handleCancelLocal = () => {
    setName('');
    setPhone('');
    setDate('');
    setMedicineEntries([{ name: '', quantity: '' }]);
    onCancel();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const addMedicineRow = () => {
    setMedicineEntries([...medicineEntries, { name: '', quantity: '' }]);
  };

  const removeMedicineRow = (index: number) => {
    if (medicineEntries.length > 1) {
      const updated = medicineEntries.filter((_, i) => i !== index);
      setMedicineEntries(updated);
    }
  };

  const updateMedicineName = (index: number, value: string) => {
    const updated = [...medicineEntries];
    updated[index].name = value;
    setMedicineEntries(updated);
  };

  const updateMedicineQuantity = (index: number, value: string) => {
    const updated = [...medicineEntries];
    updated[index].quantity = value;
    setMedicineEntries(updated);
  };

  const modalTitle = editingPatient ? 'Edit Patient Record' : 'Add Patient Record';

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
                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                  <Text style={styles.modalTitle}>{modalTitle}</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Patient Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter patient name"
                      placeholderTextColor="#ADB5BD"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+91 98765 43210"
                      placeholderTextColor="#ADB5BD"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Purchase Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD (e.g. 2026-01-24)"
                      placeholderTextColor="#ADB5BD"
                      value={date}
                      onChangeText={setDate}
                      editable={!submitting}
                    />
                    <TouchableOpacity onPress={() => setDate(getTodayDate())} disabled={submitting}>
                      <Text style={styles.todayButton}>Use Today's Date</Text>
                    </TouchableOpacity>
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
                          placeholderTextColor="#ADB5BD"
                          value={entry.name}
                          onChangeText={(value) => updateMedicineName(index, value)}
                          editable={!submitting}
                        />
                        <TextInput
                          style={[styles.input, styles.quantityInput]}
                          placeholder="Qty"
                          placeholderTextColor="#ADB5BD"
                          value={entry.quantity}
                          onChangeText={(value) => updateMedicineQuantity(index, value)}
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
                        submitting && styles.disabledButton
                      ]}
                      onPress={handleCancelLocal}
                      activeOpacity={0.7}
                      disabled={submitting}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.saveButton,
                        submitting && styles.disabledButton
                      ]}
                      onPress={handleSave}
                      disabled={submitting}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.saveButtonText,
                        submitting && styles.disabledButtonText
                      ]}>
                        {submitting ? 'Saving...' : (editingPatient ? 'Update' : 'Save')}
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

// ... all your existing styles + NEW disabled styles
const styles = StyleSheet.create({
  modalOverlay: { flex: 1 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
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
    letterSpacing: -0.5,
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
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
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
  quantityInput: { width: 70 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    color: '#DC2626',
    fontWeight: '300',
    marginTop: -2,
  },
  todayButton: {
    fontSize: 13,
    color: '#1971C2',
    marginTop: 6,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  // ✅ NEW: Disabled states for submitting
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  disabledButtonText: {
    color: '#E5E7EB',
  },
});
