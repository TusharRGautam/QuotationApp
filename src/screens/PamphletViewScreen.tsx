import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, Quotation} from '../types';
import {COMPANY_DETAILS} from '../utils/companyConfig';
import {calculateQuotationTotal, generateQuotationPDF} from '../utils/quotationGenerator';
import Share from 'react-native-share';

type PamphletViewNavigationProp = StackNavigationProp<RootStackParamList, 'PamphletView'>;
type PamphletViewRouteProp = RouteProp<RootStackParamList, 'PamphletView'>;

interface Props {
  navigation: PamphletViewNavigationProp;
  route: PamphletViewRouteProp;
}

const PamphletViewScreen: React.FC<Props> = ({navigation, route}) => {
  const {quotation} = route.params;
  const {subtotal, totalTax, grandTotal} = calculateQuotationTotal(quotation.products);
  const quotationDate = new Date(quotation.createdAt).toLocaleDateString();

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: `Quotation ${quotation.quotationNumber}`,
        message: `📄 Quotation ${quotation.quotationNumber}
        
🏢 From: ${COMPANY_DETAILS.companyName}
👤 For: ${quotation.customerDetails.customerName}
📅 Date: ${quotationDate}
💰 Total: ₹${grandTotal.toFixed(2)}

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

  const handleDownloadPDF = async () => {
    try {
      Alert.alert(
        'Generating PDF...',
        'Please wait while we generate your quotation PDF.',
        [],
        { cancelable: false }
      );

      const pdfPath = await generateQuotationPDF(quotation);
      
      Alert.alert(
        'PDF Downloaded Successfully!',
        `Your quotation PDF has been saved to:\n${pdfPath}`,
        [
          {
            text: 'Share PDF',
            onPress: async () => {
              try {
                await Share.open({
                  url: `file://${pdfPath}`,
                  type: 'application/pdf',
                  title: `Quotation ${quotation.quotationNumber}`,
                });
              } catch (shareError) {
                if (shareError instanceof Error && shareError.message !== 'User did not share') {
                  Alert.alert('Error', 'Failed to share PDF');
                }
              }
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const renderProductRow = (product: any, index: number) => {
    const productSubtotal = product.quantity * product.price;
    const productTaxAmount = (productSubtotal * product.tax) / 100;
    const productTotal = productSubtotal + productTaxAmount;

    return (
      <View key={product.id} style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.srNoCell]}>{index + 1}</Text>
        <View style={[styles.tableCell, styles.descriptionCell]}>
          <Text style={styles.productName}>{product.productName}</Text>
          {product.description && <Text style={styles.productDescription}>{product.description}</Text>}
          {product.hsn && <Text style={styles.hsnText}>HSN: {product.hsn}</Text>}
        </View>
        <Text style={[styles.tableCell, styles.centerCell]}>{product.quantity}</Text>
        <Text style={[styles.tableCell, styles.centerCell]}>{product.unitOfMeasure}</Text>
        <Text style={[styles.tableCell, styles.rightCell]}>₹{product.price.toFixed(2)}</Text>
        <Text style={[styles.tableCell, styles.centerCell]}>{product.tax}%</Text>
        <Text style={[styles.tableCell, styles.rightCell]}>₹{productSubtotal.toFixed(2)}</Text>
        <Text style={[styles.tableCell, styles.rightCell]}>₹{productTaxAmount.toFixed(2)}</Text>
        <Text style={[styles.tableCell, styles.rightCell, styles.totalCell]}>₹{productTotal.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quotation</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDownloadPDF} style={styles.actionButton}>
            <Text style={styles.downloadButton}>📥 PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Text style={styles.shareButton}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.pamphlet}>
          {/* Company Header */}
          <View style={styles.companyHeader}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{COMPANY_DETAILS.companyName}</Text>
              <Text style={styles.ownerName}>{COMPANY_DETAILS.ownerName}</Text>
              <Text style={styles.companyAddress}>{COMPANY_DETAILS.address}</Text>
              <Text style={styles.companyContact}>Contact: {COMPANY_DETAILS.contact}</Text>
            </View>
          </View>

          {/* Tax Invoice Title */}
          <View style={styles.invoiceTitle}>
            <Text style={styles.invoiceTitleText}>TAX INVOICE</Text>
          </View>

          {/* Invoice Details Section */}
          <View style={styles.invoiceDetails}>
            <View style={styles.billToSection}>
              <Text style={styles.sectionTitle}>BILL TO:</Text>
              <Text style={styles.customerName}>{quotation.customerDetails.customerName}</Text>
              <Text style={styles.customerAddress}>{quotation.customerDetails.address}</Text>
              <Text style={styles.customerContact}>Phone: {quotation.customerDetails.phoneNumber}</Text>
              <Text style={styles.customerEmail}>Email: {quotation.customerDetails.email}</Text>
            </View>
            
            <View style={styles.invoiceInfoSection}>
              <Text style={styles.sectionTitle}>INVOICE DETAILS:</Text>
              <Text style={styles.invoiceDetail}><Text style={styles.bold}>Invoice #:</Text> {quotation.quotationNumber}</Text>
              <Text style={styles.invoiceDetail}><Text style={styles.bold}>Invoice Date:</Text> {quotationDate}</Text>
              <Text style={styles.invoiceDetail}><Text style={styles.bold}>Due Date:</Text> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.srNoCell]}>Sr.</Text>
            <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Price</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Tax %</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Subtotal</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Tax Amt</Text>
            <Text style={[styles.tableHeaderCell, styles.centerCell]}>Total</Text>
          </View>

          {/* Table Body */}
          <View style={styles.tableBody}>
            {quotation.products.map((product, index) => renderProductRow(product, index))}
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Tax:</Text>
              <Text style={styles.totalValue}>₹{totalTax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
              <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Terms Section */}
          {quotation.terms && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms & Conditions:</Text>
              <Text style={styles.termsText}>{quotation.terms}</Text>
            </View>
          )}

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureFor}>For, {COMPANY_DETAILS.companyName.toUpperCase()}</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>AUTHORIZED SIGNATURE</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thank you for your business!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 15,
  },
  downloadButton: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  shareButton: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  pamphlet: {
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  companyHeader: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 25,
    paddingHorizontal: 20,
    position: 'relative',
  },
  companyInfo: {
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e7ff',
    marginBottom: 12,
  },
  companyAddress: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 6,
  },
  companyContact: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  invoiceTitle: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    marginBottom: 0,
  },
  invoiceTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dc2626',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  billToSection: {
    flex: 1,
    marginRight: 15,
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  invoiceInfoSection: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  customerAddress: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  customerContact: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  customerEmail: {
    fontSize: 13,
    color: '#6b7280',
  },
  invoiceDetail: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '600',
    color: '#1f2937',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    color: 'white',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableBody: {
    marginHorizontal: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
    minHeight: 50,
    backgroundColor: '#ffffff',
  },
  tableCell: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#f3f4f6',
    justifyContent: 'center',
  },
  srNoCell: {
    width: '6%',
    textAlign: 'center',
  },
  descriptionCell: {
    width: '30%',
    paddingLeft: 4,
  },
  centerCell: {
    width: '8%',
    textAlign: 'center',
  },
  rightCell: {
    width: '10%',
    textAlign: 'right',
  },
  totalCell: {
    fontWeight: 'bold',
    width: '11%',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 14,
  },
  hsnText: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '500',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginTop: 25,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 220,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9fafb',
    marginBottom: 2,
    borderRadius: 6,
  },
  grandTotalRow: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  termsSection: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 25,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
  signatureSection: {
    alignItems: 'flex-end',
    marginTop: 30,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  signatureFor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 50,
  },
  signatureLine: {
    width: 180,
    height: 2,
    backgroundColor: '#1f2937',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default PamphletViewScreen;