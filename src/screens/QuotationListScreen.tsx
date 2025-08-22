import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Quotation} from '../types';
import Share from 'react-native-share';
import {loadQuotations} from '../utils/storage';
import {useFocusEffect} from '@react-navigation/native';

type QuotationListNavigationProp = StackNavigationProp<RootStackParamList, 'QuotationList'>;

interface Props {
  navigation: QuotationListNavigationProp;
}

const QuotationListScreen: React.FC<Props> = ({navigation}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadQuotationsList();
    }, [])
  );

  const loadQuotationsList = async () => {
    try {
      const savedQuotations = await loadQuotations();
      setQuotations(savedQuotations.reverse()); // Show newest first
    } catch (error) {
      Alert.alert('Error', 'Failed to load quotations');
      console.error('Error loading quotations:', error);
    }
  };

  const handleShare = async (quotation: Quotation) => {
    try {
      const totalAmount = quotation.products.reduce((total, product) => {
        const subtotal = product.quantity * product.price;
        const tax = (subtotal * product.tax) / 100;
        return total + subtotal + tax;
      }, 0);

      const shareOptions = {
        title: `Quotation ${quotation.quotationNumber}`,
        message: `📄 Quotation ${quotation.quotationNumber}
        
🏢 From: ${quotation.businessDetails.businessName}
👤 For: ${quotation.customerDetails.customerName}
📅 Date: ${new Date(quotation.createdAt).toLocaleDateString()}
💰 Total: ₹${totalAmount.toFixed(2)}

${quotation.products.length} product(s) included in this quotation.

Generated with Quotation App`,
        subject: `Quotation ${quotation.quotationNumber} - ${quotation.customerDetails.customerName}`,
      };

      await Share.open(shareOptions);
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share quotation');
      }
    }
  };

  const handleViewQuotation = (quotation: Quotation) => {
    navigation.navigate('PamphletView', {quotation});
  };

  const renderQuotationItem = ({item}: {item: Quotation}) => (
    <TouchableOpacity 
      style={styles.quotationCard}
      onPress={() => handleViewQuotation(item)}>
      <View style={styles.quotationHeader}>
        <Text style={styles.quotationNumber}>#{item.quotationNumber}</Text>
        <Text style={styles.quotationDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.customerName}>{item.customerDetails.customerName}</Text>
      <Text style={styles.businessName}>{item.businessDetails.businessName}</Text>
      <Text style={styles.productCount}>{item.products.length} product(s)</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewQuotation(item)}>
          <Text style={styles.viewButtonText}>View Quotation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare(item)}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quotations</Text>
      </View>
      
      {quotations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No quotations found</Text>
          <Text style={styles.emptySubtext}>Create your first quotation to get started</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('QuotationForm')}>
            <Text style={styles.createButtonText}>Create Quotation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quotations}
          renderItem={renderQuotationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  listContainer: {
    padding: 20,
  },
  quotationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quotationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quotationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  quotationDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  businessName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  productCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuotationListScreen;