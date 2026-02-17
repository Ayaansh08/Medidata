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

import { Narcotic, Medicine } from '../services/api';

interface AddNarcoticsModalProps {
  visible: boolean;
  onSave: (
    name: string,
    phone: string,
    purchase_date: string,
    medicines: Medicine[]
  ) => void;
  onCancel: () => void;
  editingNarcotic: Narcotic | null;
  submitting?: boolean;
}

interface MedicineEntry {
  name: string;
  qty: string;
  price: string;
}

const INPUT_PLACEHOLDER_COLOR = '#64748B';

const formatToDisplayDate = (value: string) => {
  if (!value) return '';

  const apiDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (apiDateMatch) {
    return `${apiDateMatch[3]}-${apiDateMatch[2]}-${apiDateMatch[1]}`;
  }

  return value;
};

const normalizeToApiDate = (value: string) => {
  const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return null;

  return `${match[3]}-${match[2]}-${match[1]}`;
};

export default function AddNarcoticsModal({
  visible,
  onSave,
  onCancel,
  editingNarcotic,
  submitting = false,
}: AddNarcoticsModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [medicineEntries, setMedicineEntries] = useState<MedicineEntry[]>([
    { name: '', qty: '', price: '' },
  ]);

  useEffect(() => {
    if (visible && editingNarcotic) {
      setName(editingNarcotic.name);
      setPhone(editingNarcotic.phone);
      setPurchaseDate(formatToDisplayDate(editingNarcotic.purchase_date));

      const mappedMedicines =
        editingNarcotic.medicines.length > 0
          ? editingNarcotic.medicines.map((m) => ({
              name: m.name,
              qty: String(m.qty),
              price: String(m.price ?? ''),
            }))
          : [{ name: '', qty: '', price: '' }];

      setMedicineEntries(mappedMedicines);
    }

    if (visible && !editingNarcotic) {
      setName('');
      setPhone('');
      setPurchaseDate('');
      setMedicineEntries([{ name: '', qty: '', price: '' }]);
    }
  }, [visible, editingNarcotic]);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addMedicineRow = () => {
    setMedicineEntries([...medicineEntries, { name: '', qty: '', price: '' }]);
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
    if (!name.trim() || !purchaseDate.trim()) return;

    const apiPurchaseDate = normalizeToApiDate(purchaseDate);
    if (!apiPurchaseDate) return;

    const medicines: Medicine[] = medicineEntries
      .filter((m) => m.name.trim())
      .map((m) => ({
        name: m.name.trim(),
        qty: Number(m.qty) || 1,
        price: Number(m.price) || 0,
      }));

    if (medicines.length === 0) return;

    onSave(name.trim(), phone.trim(), apiPurchaseDate, medicines);
  };

  const modalTitle = editingNarcotic ? 'Edit Narcotic Record' : 'Add Narcotic Record';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{modalTitle}</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Patient Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter patient name"
                      placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                      value={name}
                      onChangeText={setName}
                      editable={!submitting}
                      selectionColor="#0F172A"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+91 98765 43210"
                      placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      editable={!submitting}
                      selectionColor="#0F172A"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Purchase Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="DD-MM-YYYY"
                      placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                      value={purchaseDate}
                      onChangeText={setPurchaseDate}
                      editable={!submitting}
                      selectionColor="#0F172A"
                    />
                    <TouchableOpacity
                      onPress={() => setPurchaseDate(getTodayDate())}
                      disabled={submitting}
                    >
                      <Text style={styles.todayButton}>Use Today's Date</Text>
                    </TouchableOpacity>
                  </View>

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
                          placeholder="Medicine"
                          placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                          value={entry.name}
                          onChangeText={(v) => updateMedicine(index, 'name', v)}
                          editable={!submitting}
                          selectionColor="#0F172A"
                        />
                        <TextInput
                          style={[styles.input, styles.quantityInput]}
                          placeholder="Qty"
                          placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                          value={entry.qty}
                          onChangeText={(v) => updateMedicine(index, 'qty', v)}
                          keyboardType="number-pad"
                          editable={!submitting}
                          selectionColor="#0F172A"
                        />
                        <TextInput
                          style={[styles.input, styles.priceInput]}
                          placeholder="Rs"
                          placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                          value={entry.price}
                          onChangeText={(v) => updateMedicine(index, 'price', v)}
                          keyboardType="number-pad"
                          editable={!submitting}
                          selectionColor="#0F172A"
                        />
                        {medicineEntries.length > 1 ? (
                          <TouchableOpacity
                            onPress={() => removeMedicineRow(index)}
                            style={styles.removeButton}
                            disabled={submitting}
                          >
                            <Text style={styles.removeButtonText}>x</Text>
                          </TouchableOpacity>
                        ) : null}
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
                      onPress={onCancel}
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
                        {submitting ? 'Saving...' : editingNarcotic ? 'Update' : 'Save'}
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
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  medicineRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  medicineNameInput: { flex: 1 },
  quantityInput: { width: 64 },
  priceInput: { width: 72 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: '#DC2626',
    fontWeight: '700',
  },
  todayButton: {
    fontSize: 13,
    color: '#0369A1',
    marginTop: 6,
    fontWeight: '600',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
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
