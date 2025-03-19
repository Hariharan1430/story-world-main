export type ValidationRule = {
  required?: boolean; // Whether the field is required
  regex?: {
    pattern: RegExp; // Validation pattern
    message: string; // Error message for regex mismatch
  };
  maxLength?: {
    value: number; // Maximum length allowed
    message: string; // Error message for exceeding max length
  };
};

export const validateField = (
  field: string,
  value: string,
  rules: ValidationRule
): string => {
  try {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    // Check if the field is required and empty
    if (rules.required && !value.trim()) {
      return `${fieldName} is required.`;
    }

    // Check if the value exceeds the maximum length
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message || `${fieldName} must be ${rules.maxLength.value} characters or less.`;
    }

    // Check if the value matches the regex pattern
    if (rules.regex && !rules.regex.pattern.test(value)) {
      return rules.regex.message || `${fieldName} is invalid.`;
    }

    // If all validations pass, return an empty string
    return "";
  } catch (error) {
    console.error("Validation error:", error);
    return "Validation error occurred.";
  }
};
