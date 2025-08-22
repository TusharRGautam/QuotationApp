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
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Product} from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Product[]) => void;
  initialData?: Product[];
}

const ProductsDetailsModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: '',
    productName: '',
    quantity: 1,
    unitOfMeasure: 'SET',
    tax: 18,
    description: '',
    hsn: '',
    price: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProducts(initialData);
    } else {
      setProducts([]);
    }
  }, [initialData, visible]);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleAddProduct = () => {
    if (!currentProduct.productName.trim()) {
      Alert.alert('Validation Error', 'Product name is required');
      return;
    }
    if (currentProduct.quantity <= 0) {
      Alert.alert('Validation Error', 'Quantity must be greater than 0');
      return;
    }
    if (currentProduct.price < 0) {
      Alert.alert('Validation Error', 'Price must be 0 or greater');
      return;
    }

    if (isEditing && editingId) {
      setProducts(prev =>
        prev.map(p => (p.id === editingId ? {...currentProduct, id: editingId} : p))
      );
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newProduct: Product = {
        ...currentProduct,
        id: generateId(),
      };
      setProducts(prev => [...prev, newProduct]);
    }

    setCurrentProduct({
      id: '',
      productName: '',
      quantity: 1,
      unitOfMeasure: 'SET',
      tax: 18,
      description: '',
      hsn: '',
      price: 0,
    });
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setEditingId(product.id);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (products.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one product');
      return;
    }
    onSave(products);
    onClose();
  };

  const renderProduct = ({item}: {item: Product}) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProduct(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.productDetail}>
        Qty: {item.quantity} {item.unitOfMeasure} | Price: ₹{item.price} | Tax: {item.tax}%
      </Text>
      {item.description && (
        <Text style={styles.productDescription}>{item.description}</Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Products Details</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={currentProduct.productName}
                onChangeText={text =>
                  setCurrentProduct({...currentProduct, productName: text})
                }
                placeholder="Enter product name"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  value={currentProduct.quantity.toString()}
                  onChangeText={text =>
                    setCurrentProduct({
                      ...currentProduct,
                      quantity: parseInt(text) || 1,
                    })
                  }
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Unit of Measure *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={currentProduct.unitOfMeasure}
                    onValueChange={value =>
                      setCurrentProduct({...currentProduct, unitOfMeasure: value})
                    }>
                    <Picker.Item label="SET" value="SET" />
                    <Picker.Item label="KG" value="KG" />
                    <Picker.Item label="PCS" value="PCS" />
                    <Picker.Item label="METER" value="METER" />
                    <Picker.Item label="LITER" value="LITER" />
                    <Picker.Item label="DOZEN" value="DOZEN" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  value={currentProduct.price.toString()}
                  onChangeText={text =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(text) || 0,
                    })
                  }
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Tax (%) *</Text>
                <TextInput
                  style={styles.input}
                  value={currentProduct.tax.toString()}
                  onChangeText={text =>
                    setCurrentProduct({
                      ...currentProduct,
                      tax: parseFloat(text) || 0,
                    })
                  }
                  placeholder="18"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>HSN Code</Text>
              <TextInput
                style={styles.input}
                value={currentProduct.hsn}
                onChangeText={text =>
                  setCurrentProduct({...currentProduct, hsn: text})
                }
                placeholder="Enter HSN code"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentProduct.description}
                onChangeText={text =>
                  setCurrentProduct({...currentProduct, description: text})
                }
                placeholder="Enter product description"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Text style={styles.addButtonText}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </Text>
            </TouchableOpacity>
          </View>

          {products.length > 0 && (
            <View style={styles.productsList}>
              <Text style={styles.sectionTitle}>Added Products ({products.length})</Text>
              <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
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
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  inputGroup: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: 'white',
    height: 40,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#2c3e50',
    fontStyle: 'italic',
  },
});

export default ProductsDetailsModal;