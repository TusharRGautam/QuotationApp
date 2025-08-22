export interface BusinessDetails {
  businessName: string;
  businessEmail: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  taxType: 'GST' | 'PAN' | 'VAT' | 'Business';
  taxNumber: string;
}

export interface CustomerDetails {
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface Product {
  id: string;
  productName: string;
  quantity: number;
  unitOfMeasure: string;
  tax: number;
  description: string;
  hsn: string;
  price: number;
}

export interface Quotation {
  id: string;
  businessDetails: BusinessDetails;
  customerDetails: CustomerDetails;
  products: Product[];
  terms: string;
  createdAt: string;
  quotationNumber: string;
}

export type RootStackParamList = {
  Home: undefined;
  QuotationForm: undefined;
  QuotationList: undefined;
  PamphletView: {
    quotation: Quotation;
  };
};