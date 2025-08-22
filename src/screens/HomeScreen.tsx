import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import {COMPANY_DETAILS} from '../utils/companyConfig';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const screenWidth = Dimensions.get('window').width;
  const cardSize = (screenWidth - 60) / 2; // Two cards per row with margins

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.companyBrand}>
          <Text style={styles.companyName}>{COMPANY_DETAILS.companyName}</Text>
          <Text style={styles.tagline}>Steel Trading Solutions</Text>
        </View>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, {width: cardSize, height: cardSize}]}
            onPress={() => navigation.navigate('QuotationForm')}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>📝</Text>
            </View>
            <Text style={styles.cardTitle}>Create</Text>
            <Text style={styles.cardTitle}>Quotation</Text>
            <Text style={styles.cardSubtitle}>Generate new quotes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, {width: cardSize, height: cardSize}]}
            onPress={() => navigation.navigate('QuotationList')}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>📋</Text>
            </View>
            <Text style={styles.cardTitle}>View</Text>
            <Text style={styles.cardTitle}>Quotations</Text>
            <Text style={styles.cardSubtitle}>Browse saved quotes</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Cards Row */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.disabledCard, {width: cardSize, height: cardSize}]}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardTitle}>&nbsp;</Text>
            <Text style={styles.cardSubtitle}>Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.disabledCard, {width: cardSize, height: cardSize}]}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>⚙️</Text>
            </View>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardTitle}>&nbsp;</Text>
            <Text style={styles.cardSubtitle}>Coming Soon</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 {COMPANY_DETAILS.companyName}</Text>
        <Text style={styles.footerSubtext}>Powered by Quotation App</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  companyBrand: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 18,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  disabledCard: {
    backgroundColor: '#f8fafc',
    opacity: 0.6,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  iconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default HomeScreen;