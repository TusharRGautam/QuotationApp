import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {BusinessDetails} from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: BusinessDetails) => void;
  initialData?: BusinessDetails | null;
}

const BusinessDetailsModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<BusinessDetails>({
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    taxType: 'GST',
    taxNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        businessName: '',
        businessEmail: '',
        phoneNumber: '',
        address1: '',
        address2: '',
        taxType: 'GST',
        taxNumber: '',
      });
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!formData.businessName.trim()) {
      Alert.alert('Validation Error', 'Business name is required');
      return;
    }
    if (!formData.businessEmail.trim()) {
      Alert.alert('Validation Error', 'Business email is required');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return;
    }
    if (!formData.address1.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return;
    }
    if (!formData.taxNumber.trim()) {
      Alert.alert('Validation Error', 'Tax number is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Business Details</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.businessName}
              onChangeText={text => setFormData({...formData, businessName: text})}
              placeholder="Enter business name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.businessEmail}
              onChangeText={text => setFormData({...formData, businessEmail: text})}
              placeholder="Enter business email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={text => setFormData({...formData, phoneNumber: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address 1 *</Text>
            <TextInput
              style={styles.input}
              value={formData.address1}
              onChangeText={text => setFormData({...formData, address1: text})}
              placeholder="Enter address line 1"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address 2</Text>
            <TextInput
              style={styles.input}
              value={formData.address2}
              onChangeText={text => setFormData({...formData, address2: text})}
              placeholder="Enter address line 2"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tax Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.taxType}
                onValueChange={value =>
                  setFormData({...formData, taxType: value as any})
                }>
                <Picker.Item label="GST" value="GST" />
                <Picker.Item label="PAN" value="PAN" />
                <Picker.Item label="VAT" value="VAT" />
                <Picker.Item label="Business" value="Business" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{formData.taxType} Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.taxNumber}
              onChangeText={text => setFormData({...formData, taxNumber: text})}
              placeholder={`Enter ${formData.taxType} number`}
            />
          </View>
        </ScrollView>
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
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: 'white',
  },
});

export default BusinessDetailsModal;