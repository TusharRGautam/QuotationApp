import RNFS from 'react-native-fs';
import {Quotation} from '../types';

const QUOTATIONS_FILE = 'quotations.json';

export const getDocumentsDirectory = (): string => {
  return RNFS.DocumentDirectoryPath;
};

export const getQuotationsFilePath = (): string => {
  return `${getDocumentsDirectory()}/${QUOTATIONS_FILE}`;
};

export const saveQuotation = async (quotation: Quotation): Promise<void> => {
  try {
    const filePath = getQuotationsFilePath();
    let existingQuotations: Quotation[] = [];

    // Check if file exists and read existing data
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      const fileContent = await RNFS.readFile(filePath, 'utf8');
      existingQuotations = JSON.parse(fileContent);
    }

    // Add new quotation
    existingQuotations.push(quotation);

    // Save updated data
    await RNFS.writeFile(filePath, JSON.stringify(existingQuotations, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving quotation:', error);
    throw new Error('Failed to save quotation');
  }
};

export const loadQuotations = async (): Promise<Quotation[]> => {
  try {
    const filePath = getQuotationsFilePath();
    const fileExists = await RNFS.exists(filePath);
    
    if (!fileExists) {
      return [];
    }

    const fileContent = await RNFS.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading quotations:', error);
    return [];
  }
};

export const deleteQuotation = async (quotationId: string): Promise<void> => {
  try {
    const quotations = await loadQuotations();
    const updatedQuotations = quotations.filter(q => q.id !== quotationId);
    
    const filePath = getQuotationsFilePath();
    await RNFS.writeFile(filePath, JSON.stringify(updatedQuotations, null, 2), 'utf8');
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw new Error('Failed to delete quotation');
  }
};

export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    // For React Native, file system permissions are usually handled automatically
    // This function can be expanded for more specific permission handling if needed
    const documentsPath = getDocumentsDirectory();
    const testFile = `${documentsPath}/test.txt`;
    
    // Test write permission
    await RNFS.writeFile(testFile, 'test', 'utf8');
    await RNFS.unlink(testFile);
    
    return true;
  } catch (error) {
    console.error('Storage permission error:', error);
    return false;
  }
};

export const clearAllQuotations = async (): Promise<void> => {
  try {
    const filePath = getQuotationsFilePath();
    const fileExists = await RNFS.exists(filePath);
    
    if (fileExists) {
      await RNFS.unlink(filePath);
    }
  } catch (error) {
    console.error('Error clearing quotations:', error);
    throw new Error('Failed to clear quotations');
  }
};