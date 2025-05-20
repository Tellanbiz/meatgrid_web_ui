/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: KSH)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency = 'KSH'): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
};

/**
 * Format a weight value with its unit
 * @param weight - The weight value
 * @param unitType - The unit type (kg, g, etc)
 * @returns Formatted weight string
 */
export const formatWeight = (weight: number, unitType: string): string => {
  return `${weight} ${unitType}`;
};
