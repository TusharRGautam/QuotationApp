import {Quotation, Product} from '../types';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {COMPANY_DETAILS} from './companyConfig';

export const generateQuotationNumber = (): string => {
  const prefix = 'ZS'; // Zhoop Steels
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${year}-${randomNum}`;
};

export const calculateProductTotal = (product: Product): number => {
  const subtotal = product.quantity * product.price;
  const taxAmount = (subtotal * product.tax) / 100;
  return subtotal + taxAmount;
};

export const calculateQuotationTotal = (products: Product[]): {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
} => {
  let subtotal = 0;
  let totalTax = 0;

  products.forEach(product => {
    const productSubtotal = product.quantity * product.price;
    const productTax = (productSubtotal * product.tax) / 100;
    
    subtotal += productSubtotal;
    totalTax += productTax;
  });

  const grandTotal = subtotal + totalTax;

  return {
    subtotal,
    totalTax,
    grandTotal,
  };
};

export const generateQuotationHTML = (quotation: Quotation): string => {
  const {subtotal, totalTax, grandTotal} = calculateQuotationTotal(quotation.products);
  const quotationDate = new Date(quotation.createdAt).toLocaleDateString();

  let productsRows = '';
  quotation.products.forEach((product, index) => {
    const productSubtotal = product.quantity * product.price;
    const productTaxAmount = (productSubtotal * product.tax) / 100;
    const productTotal = productSubtotal + productTaxAmount;

    productsRows += `
      <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          <strong>${product.productName}</strong><br/>
          <small>${product.description || ''}</small>
          ${product.hsn ? `<br/><small>HSN: ${product.hsn}</small>` : ''}
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${product.quantity}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${product.unitOfMeasure}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">₹${product.price.toFixed(2)}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${product.tax}%</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">₹${productSubtotal.toFixed(2)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">₹${productTaxAmount.toFixed(2)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">₹${productTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      font-size: 12px;
      color: #333;
    }
    .header { 
      text-align: center; 
      margin-bottom: 20px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    .company-name { 
      font-size: 24px; 
      font-weight: bold; 
      color: #3498db;
      margin-bottom: 5px;
    }
    .company-tagline { 
      font-style: italic; 
      color: #7f8c8d;
      margin-bottom: 10px;
    }
    .company-details { 
      font-size: 11px; 
      line-height: 1.4;
      color: #666;
    }
    .invoice-header { 
      display: flex; 
      justify-content: space-between; 
      margin: 20px 0;
    }
    .bill-to, .invoice-info { 
      width: 45%;
    }
    .invoice-info { 
      text-align: right;
    }
    .section-title { 
      font-weight: bold; 
      font-size: 14px;
      margin-bottom: 10px;
      color: #2c3e50;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 5px;
    }
    .details { 
      line-height: 1.6;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
    }
    th { 
      background-color: #3498db; 
      color: white; 
      padding: 10px 8px; 
      text-align: center;
      font-weight: bold;
      border: 1px solid #2980b9;
    }
    td { 
      padding: 8px; 
      border: 1px solid #ddd;
    }
    .totals { 
      margin-top: 20px;
      text-align: right;
    }
    .totals table { 
      width: 300px; 
      margin-left: auto;
    }
    .totals th { 
      background-color: #f8f9fa;
      color: #2c3e50;
      text-align: right;
      font-weight: bold;
    }
    .grand-total { 
      background-color: #e8f5e8 !important;
      font-weight: bold;
      font-size: 14px;
    }
    .terms { 
      margin-top: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-left: 4px solid #3498db;
    }
    .terms-title { 
      font-weight: bold; 
      margin-bottom: 10px;
      color: #2c3e50;
    }
    .signature { 
      margin-top: 40px;
      text-align: right;
    }
    .signature-line { 
      border-top: 1px solid #333;
      width: 200px;
      margin-left: auto;
      margin-top: 50px;
      text-align: center;
      padding-top: 5px;
      font-weight: bold;
    }
    @media print {
      body { margin: 0; }
      .invoice-header { display: block; }
      .bill-to, .invoice-info { width: 100%; margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">${COMPANY_DETAILS.companyName}</div>
    <div class="company-tagline">Steel Trading Solutions</div>
    <div class="company-details">
      ${COMPANY_DETAILS.address}<br/>
      Phone: ${COMPANY_DETAILS.contact}<br/>
      Email: info@zhoopsteels.com<br/>
      GST: GST001ZHOOP2024
    </div>
  </div>

  <div style="text-align: center; margin: 20px 0;">
    <h2 style="color: #e74c3c; margin: 0;">TAX INVOICE</h2>
  </div>

  <div class="invoice-header">
    <div class="bill-to">
      <div class="section-title">BILL TO:</div>
      <div class="details">
        <strong>${quotation.customerDetails.customerName}</strong><br/>
        ${quotation.customerDetails.address}<br/>
        Phone: ${quotation.customerDetails.phoneNumber}<br/>
        Email: ${quotation.customerDetails.email}
      </div>
    </div>
    <div class="invoice-info">
      <div class="section-title">INVOICE DETAILS:</div>
      <div class="details">
        <strong>Invoice #:</strong> ${quotation.quotationNumber}<br/>
        <strong>Invoice Date:</strong> ${quotationDate}<br/>
        <strong>Due Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">Sr.</th>
        <th style="width: 30%;">Description</th>
        <th style="width: 8%;">Qty</th>
        <th style="width: 8%;">Unit</th>
        <th style="width: 10%;">Price</th>
        <th style="width: 8%;">Tax %</th>
        <th style="width: 10%;">Subtotal</th>
        <th style="width: 10%;">Tax Amt</th>
        <th style="width: 11%;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${productsRows}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <th>Subtotal:</th>
        <td style="text-align: right; padding: 8px;">₹${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <th>Total Tax:</th>
        <td style="text-align: right; padding: 8px;">₹${totalTax.toFixed(2)}</td>
      </tr>
      <tr class="grand-total">
        <th style="font-size: 14px;">GRAND TOTAL:</th>
        <td style="text-align: right; padding: 10px; font-weight: bold; font-size: 14px;">₹${grandTotal.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  ${quotation.terms ? `
  <div class="terms">
    <div class="terms-title">Terms & Conditions:</div>
    <div style="white-space: pre-line;">${quotation.terms}</div>
  </div>
  ` : ''}

  <div class="signature">
    <p style="margin-bottom: 60px;"><strong>For, ${COMPANY_DETAILS.companyName.toUpperCase()}</strong></p>
    <div class="signature-line">AUTHORIZED SIGNATURE</div>
  </div>

  <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #7f8c8d;">
    Thank you for your business!
  </div>
</body>
</html>
  `;
};

export const generateQuotationPDF = async (quotation: Quotation): Promise<string> => {
  try {
    const htmlContent = generateQuotationHTML(quotation);
    
    const options = {
      html: htmlContent,
      fileName: `quotation_${quotation.quotationNumber}`,
      directory: 'Documents',
      width: 595,
      height: 842,
      padding: 20,
    };

    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath || '';
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};