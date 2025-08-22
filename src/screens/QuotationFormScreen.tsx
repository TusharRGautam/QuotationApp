import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BusinessDetails, CustomerDetails, Product, RootStackParamList, Quotation} from '../types';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import ProductsDetailsModal from '../components/ProductsDetailsModal';
import TermsModal from '../components/TermsModal';
import {generateQuotationNumber, generateQuotationPDF} from '../utils/quotationGenerator';
import {saveQuotation, requestStoragePermission} from '../utils/storage';
import {COMPANY_DETAILS} from '../utils/companyConfig';

type QuotationFormNavigationProp = StackNavigationProp<RootStackParamList, 'QuotationForm'>;

interface Props {
  navigation: QuotationFormNavigationProp;
}

const QuotationFormScreen: React.FC<Props> = ({navigation}) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [terms, setTerms] = useState<string>('');
  
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  // Convert company details to business details format
  const businessDetails: BusinessDetails = {
    businessName: COMPANY_DETAILS.companyName,
    businessEmail: `info@zhoopsteels.com`, // You can update this
    phoneNumber: COMPANY_DETAILS.contact,
    address1: COMPANY_DETAILS.address,
    address2: '',
    taxType: 'GST',
    taxNumber: 'GST001ZHOOP2024', // You can update this with actual GST
  };

  const handleGenerateQuotation = async () => {
    if (!customerDetails) {
      Alert.alert('Missing Information', 'Please fill in customer details');
      return;
    }
    if (products.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one product');
      return;
    }

    try {
      // Request storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Error', 'Storage permission is required to save quotations');
        return;
      }

      // Create quotation object
      const quotation: Quotation = {
        id: Math.random().toString(36).substring(7),
        quotationNumber: generateQuotationNumber(),
        businessDetails,
        customerDetails,
        products,
        terms,
        createdAt: new Date().toISOString(),
      };

      // Generate PDF
      const pdfPath = await generateQuotationPDF(quotation);
      
      // Save quotation data
      await saveQuotation(quotation);

      Alert.alert(
        'Success', 
        `Quotation ${quotation.quotationNumber} generated successfully!\nSaved at: ${pdfPath}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate quotation. Please try again.');
      console.error('Quotation generation error:', error);
    }
  };

  const getIconStatus = (hasData: boolean) => ({
    backgroundColor: hasData ? '#2ecc71' : '#ecf0f1',
    borderColor: hasData ? '#27ae60' : '#bdc3c7',
  });

  const showCompanyInfo = () => {
    Alert.alert(
      'Company Information',
      `${COMPANY_DETAILS.companyName}\n${COMPANY_DETAILS.ownerName}\n${COMPANY_DETAILS.address}\nContact: ${COMPANY_DETAILS.contact}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Quotation</Text>
      </View>
      
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={[styles.iconCard, getIconStatus(true)]}
          onPress={showCompanyInfo}>
          <Text style={styles.iconText}>🏢</Text>
          <Text style={styles.iconLabel}>Company Info</Text>
          <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconCard, getIconStatus(!!customerDetails)]}
          onPress={() => setCustomerModalVisible(true)}>
          <Text style={styles.iconText}>👤</Text>
          <Text style={styles.iconLabel}>Customer Details</Text>
          {customerDetails && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconCard, getIconStatus(products.length > 0)]}
          onPress={() => setProductsModalVisible(true)}>
          <Text style={styles.iconText}>📦</Text>
          <Text style={styles.iconLabel}>Products Details</Text>
          {products.length > 0 && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconCard, getIconStatus(!!terms)]}
          onPress={() => setTermsModalVisible(true)}>
          <Text style={styles.iconText}>📋</Text>
          <Text style={styles.iconLabel}>Terms</Text>
          {terms && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateQuotation}>
        <Text style={styles.generateButtonText}>Generate Quotation</Text>
      </TouchableOpacity>

      <CustomerDetailsModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        onSave={setCustomerDetails}
        initialData={customerDetails}
      />

      <ProductsDetailsModal
        visible={productsModalVisible}
        onClose={() => setProductsModalVisible(false)}
        onSave={setProducts}
        initialData={products}
      />

      <TermsModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        onSave={setTerms}
        initialData={terms}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCard: {
    width: '40%',
    height: 120,
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    position: 'relative',
  },
  iconText: {
    fontSize: 32,
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#27ae60',
    fontSize: 18,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuotationFormScreen;