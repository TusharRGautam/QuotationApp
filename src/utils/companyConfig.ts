export interface CompanyDetails {
  companyName: string;
  ownerName: string;
  address: string;
  contact: string;
  logoPath: string;
}

export const COMPANY_DETAILS: CompanyDetails = {
  companyName: 'Zhoop Steels',
  ownerName: 'Tushar Gautam',
  address: 'Ulhasnagar, hsg, hsg, hsg, hsgj.',
  contact: '8169151456',
  logoPath: '', // Add logo path when Companylogo.png is available
};

// GST Number and other business details can be added here
export const COMPANY_BUSINESS_INFO = {
  gstNumber: 'GST001ZHOOP2024', // You can update this with actual GST number
  emailDomain: '@zhoopsteels.com',
  website: 'www.zhoopsteels.com',
  businessType: 'Steel Trading',
};