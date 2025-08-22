# Quotation App

A React Native application for creating, managing, and sharing business quotations with professional PDF generation.

## Features

- 📱 **Mobile-First Design**: Clean, intuitive interface optimized for mobile devices
- 🏢 **Business Details Management**: Store and reuse your business information
- 👤 **Customer Management**: Easy customer information input
- 📦 **Product Management**: Add multiple products with pricing, tax, and descriptions
- 📋 **Terms & Conditions**: Customizable terms with default templates
- 📄 **Professional PDF Generation**: Generate beautifully formatted quotations based on invoice template
- 💾 **Local Storage**: All data stored locally on device in JSON format
- 📤 **Easy Sharing**: Share quotations via WhatsApp, Email, and other apps
- 🔢 **Automatic Calculations**: Tax calculations and totals computed automatically

## Screenshots

The app includes:
- Home screen with easy navigation
- Quotation creation with 4 main sections (Business, Customer, Products, Terms)
- Modal-based forms for each section
- Professional quotation list view
- Integrated sharing functionality

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- Android Studio (for Android development)
- Android device or emulator

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install iOS dependencies** (if targeting iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start Metro bundler**:
   ```bash
   npm start
   ```

4. **Run on Android**:
   ```bash
   npm run android
   ```

5. **Run on iOS** (macOS only):
   ```bash
   npm run ios
   ```

### Permissions

The app requires the following permissions for full functionality:
- **File Storage**: To save quotations and PDFs locally
- **External Storage**: To generate and store PDF files

## Usage Guide

### 1. Creating a Quotation

1. **Tap "Create Quotation"** from the home screen
2. **Fill in Business Details**: Your company information (reusable)
3. **Add Customer Details**: Client information
4. **Add Products**: Multiple products with pricing and tax details
5. **Set Terms**: Add terms and conditions (optional)
6. **Generate**: Create the quotation PDF

### 2. Managing Quotations

- **View All**: Access "View Quotations" to see all created quotations
- **Share**: Tap the share button on any quotation to send via various apps
- **Search**: Quotations are listed with customer names and dates for easy identification

### 3. Business Details

The Business Details modal includes:
- Business Name *
- Business Email *
- Phone Number *
- Address 1 *
- Address 2
- Tax Type (GST/PAN/VAT/Business) *
- Tax Number *

### 4. Product Management

For each product, you can specify:
- Product Name *
- Quantity *
- Unit of Measure (SET, KG, PCS, METER, LITER, DOZEN)
- Price *
- Tax Percentage *
- HSN Code
- Description

### 5. PDF Generation

The app generates professional invoices with:
- Company branding and details
- Customer information
- Detailed product listing with calculations
- Tax breakdowns
- Terms and conditions
- Professional formatting matching the provided template

## Technical Details

### Architecture

- **React Native 0.81**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation and routing
- **React Native Modal**: Modal components for forms
- **React Native HTML to PDF**: PDF generation from HTML
- **React Native FS**: File system operations
- **React Native Share**: Cross-platform sharing

### File Structure

```
src/
├── components/           # Reusable UI components
│   ├── BusinessDetailsModal.tsx
│   ├── CustomerDetailsModal.tsx
│   ├── ProductsDetailsModal.tsx
│   └── TermsModal.tsx
├── screens/             # Screen components
│   ├── HomeScreen.tsx
│   ├── QuotationFormScreen.tsx
│   └── QuotationListScreen.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    ├── quotationGenerator.ts
    └── storage.ts
```

### Data Storage

- **Local Storage**: All quotation data is stored locally using React Native FS
- **JSON Format**: Data is stored in a structured JSON file
- **No Internet Required**: App works completely offline

### Quotation Numbering

Quotations use the format: `PRAX-YYYY-XXX`
- PRAX: Company prefix
- YYYY: Current year
- XXX: Random 3-digit number

## Customization

### Styling

The app uses a consistent color scheme:
- Primary Blue: #3498db
- Success Green: #2ecc71
- Warning Red: #e74c3c
- Text Dark: #2c3e50
- Text Light: #7f8c8d

### Terms Template

Default terms and conditions are provided but can be customized per quotation.

### PDF Template

The PDF template is based on the provided invoice design and includes:
- Professional header with company branding
- Detailed product table
- Tax calculations
- Terms and conditions section
- Signature area

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are properly installed
2. **PDF Generation**: Check file system permissions on device
3. **Sharing Issues**: Verify share apps are installed on device

### Android Specific

- Ensure proper SDK setup
- Check emulator/device connectivity
- Verify file permissions in AndroidManifest.xml

## Future Enhancements

Potential improvements:
- Cloud backup/sync
- Multiple business profiles
- Advanced product catalog
- Email integration
- Payment tracking
- Reports and analytics

## Support

For issues and questions:
1. Check the troubleshooting section
2. Verify all setup steps were completed
3. Check device permissions

---

**Note**: This app is designed for local use and doesn't require internet connectivity after installation.