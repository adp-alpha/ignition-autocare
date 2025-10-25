/**
 * Validation utilities for booking forms
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  // Check for basic structure first
  if (!email.includes("@")) {
    return { isValid: false, message: "Email must contain @ symbol" };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      message: "Email must contain exactly one @ symbol",
    };
  }

  const [localPart, domainPart] = parts;

  // Check local part (before @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, message: "Email must have text before @ symbol" };
  }

  // Check domain part (after @)
  if (!domainPart || domainPart.length === 0) {
    return {
      isValid: false,
      message: "Email must have a domain after @ symbol",
    };
  }

  // Domain must contain at least one dot
  if (!domainPart.includes(".")) {
    return {
      isValid: false,
      message: "Email domain must contain a dot (e.g., .com, .co.uk)",
    };
  }

  // Check domain has valid extension
  const domainParts = domainPart.split(".");
  const extension = domainParts[domainParts.length - 1];
  if (!extension || extension.length < 2) {
    return {
      isValid: false,
      message: "Email must have a valid domain extension (e.g., .com, .co.uk)",
    };
  }

  // More comprehensive email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  // Additional checks for common issues
  if (email.length > 254) {
    return { isValid: false, message: "Email address is too long" };
  }

  if (email.includes("..")) {
    return {
      isValid: false,
      message: "Email address cannot contain consecutive dots",
    };
  }

  // Check for valid characters in local part
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return { isValid: false, message: "Email cannot start or end with a dot" };
  }

  return { isValid: true };
}

/**
 * Validate UK phone number
 */
export function validateUKPhoneNumber(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }

  // Remove all spaces, dashes, and brackets for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // UK phone numbers MUST start with 0 (domestic format)
  if (!cleanPhone.startsWith("0")) {
    return {
      isValid: false,
      message:
        "UK phone number must start with 0 (e.g., 07700 900456 or 01234 567890)",
    };
  }

  // UK phone number patterns (with leading 0)
  const ukPatterns = [
    /^07\d{9}$/, // UK mobile numbers: 07xxxxxxxxx (11 digits total)
    /^01\d{9}$/, // UK landline numbers: 01xxxxxxxxx (11 digits total)
    /^02\d{8}$/, // London landlines: 02xxxxxxxx (10 digits total)
    /^03\d{9}$/, // UK non-geographic: 03xxxxxxxxx (11 digits total)
    /^08\d{9}$/, // UK special services: 08xxxxxxxxx (11 digits total)
  ];

  const isValidFormat = ukPatterns.some((pattern) => pattern.test(cleanPhone));

  if (!isValidFormat) {
    return {
      isValid: false,
      message:
        "Please enter a valid UK phone number starting with 0 (e.g., 07700 900456 or 01234 567890)",
    };
  }

  // Check specific length requirements
  if (cleanPhone.startsWith("02") && cleanPhone.length !== 10) {
    return {
      isValid: false,
      message:
        "London numbers (02x) should be 10 digits long (e.g., 0207 123456)",
    };
  }

  if (!cleanPhone.startsWith("02") && cleanPhone.length !== 11) {
    return {
      isValid: false,
      message: "UK phone numbers should be 11 digits long (e.g., 07700 900456)",
    };
  }

  return { isValid: true };
}

/**
 * Validate name (first name or last name)
 */
export function validateName(
  name: string,
  fieldName: string = "Name"
): ValidationResult {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: `${fieldName} must be at least 2 characters long`,
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: `${fieldName} must be less than 50 characters`,
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
}

/**
 * Format UK phone number for display
 */
export function formatUKPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Format UK numbers with leading 0
  if (cleanPhone.startsWith("07")) {
    // Mobile: 07700 900456
    return `${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;
  } else if (cleanPhone.startsWith("02")) {
    // London: 0207 123456 (10 digits total)
    return `${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4)}`;
  } else if (
    cleanPhone.startsWith("01") ||
    cleanPhone.startsWith("03") ||
    cleanPhone.startsWith("08")
  ) {
    // Other landlines/services: 01234 567890
    return `${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;
  }

  return phone; // Return original if no pattern matches
}

/**
 * Validate all customer details
 */
export function validateCustomerDetails(details: {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const firstNameValidation = validateName(details.firstName, "First name");
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message!;
  }

  const lastNameValidation = validateName(details.lastName, "Last name");
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message!;
  }

  const emailValidation = validateEmail(details.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message!;
  }

  const phoneValidation = validateUKPhoneNumber(details.contactNumber);
  if (!phoneValidation.isValid) {
    errors.contactNumber = phoneValidation.message!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
