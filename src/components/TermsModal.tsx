import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: string) => void;
  initialData?: string;
}

const TermsModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [terms, setTerms] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setTerms(initialData);
    } else {
      setTerms('');
    }
  }, [initialData, visible]);

  const handleSave = () => {
    onSave(terms);
    onClose();
  };

  const defaultTerms = `Terms and Conditions:
1. Payment terms: 50% advance, 50% on delivery
2. Delivery time: 15-20 working days from the date of confirmation
3. Installation and commissioning charges extra if applicable
4. Transportation charges extra
5. Warranty: As per manufacturer's warranty
6. Any changes in the specification will affect the price
7. This quotation is valid for 30 days from the date of issue`;

  const useDefaultTerms = () => {
    setTerms(defaultTerms);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Terms & Conditions</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter your terms and conditions:</Text>
            <TextInput
              style={styles.textArea}
              value={terms}
              onChangeText={setTerms}
              placeholder="Enter terms and conditions..."
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.defaultButton} onPress={useDefaultTerms}>
            <Text style={styles.defaultButtonText}>Use Default Terms</Text>
          </TouchableOpacity>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview:</Text>
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                {terms || 'No terms entered yet...'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cancelButton: {
    fontSize: 16,
    color: '#e74c3c',
  },
  saveButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 14,
    backgroundColor: 'white',
    height: 150,
    textAlignVertical: 'top',
  },
  defaultButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  defaultButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  previewBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  previewText: {
    fontSize: 12,
    color: '#2c3e50',
    lineHeight: 18,
  },
});

export default TermsModal;