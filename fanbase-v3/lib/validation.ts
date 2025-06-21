// lib/validation.ts
import { ethers } from 'ethers';

export const validation = {
  /**
   * Validates if a string is a valid Ethereum address
   */
  isValidAddress: (address: string): boolean => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  },

  /**
   * Validates email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates if a string is not empty and has minimum length
   */
  isValidString: (str: string, minLength: number = 1): boolean => {
    return typeof str === 'string' && str.trim().length >= minLength;
  },

  /**
   * Validates if a number is within a specified range
   */
  isValidNumber: (num: number, min?: number, max?: number): boolean => {
    if (typeof num !== 'number' || isNaN(num)) {
      return false;
    }
    if (min !== undefined && num < min) {
      return false;
    }
    if (max !== undefined && num > max) {
      return false;
    }
    return true;
  },

  /**
   * Validates URL format
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validates if a file is an accepted image type
   */
  isValidImageFile: (file: File): boolean => {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return acceptedTypes.includes(file.type);
  },

  /**
   * Validates if a file size is within acceptable limits (in bytes)
   */
  isValidFileSize: (file: File, maxSizeInMB: number = 5): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  /**
   * Sanitizes input string to prevent XSS
   */
  sanitizeString: (str: string): string => {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validates gas limit is reasonable
   */
  isValidGasLimit: (gasLimit: number): boolean => {
    // Reasonable gas limits: between 21,000 and 10,000,000
    return validation.isValidNumber(gasLimit, 21000, 10000000);
  },

  /**
   * Validates transaction hash format
   */
  isValidTxHash: (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  },

  /**
   * Validates ENS name format
   */
  isValidENSName: (name: string): boolean => {
    return /^[a-zA-Z0-9.-]+\.eth$/.test(name);
  }
};

/**
 * Type for validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates user profile data
 */
export function validateUserProfile(data: {
  name?: string;
  email?: string;
  bio?: string;
  website?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (data.name && !validation.isValidString(data.name, 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (data.email && !validation.isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }

  if (data.website && !validation.isValidUrl(data.website)) {
    errors.push('Please enter a valid website URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates NFT mint parameters
 */
export function validateMintParams(data: {
  to?: string;
  gasLimit?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.to) {
    errors.push('Recipient address is required');
  } else if (!validation.isValidAddress(data.to)) {
    errors.push('Invalid recipient address format');
  }

  if (data.gasLimit && !validation.isValidGasLimit(data.gasLimit)) {
    errors.push('Gas limit must be between 21,000 and 10,000,000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

