import { Column } from 'typeorm';

/**
 * Decorator that marks a specific class property as a decimal column.
 * @param precision The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values.
 * @param scale The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision.
 */
export const Decimal = (
  precision = 20,
  scale = 3,
  other = {},
): PropertyDecorator => {
  return Column({
    type: 'decimal',
    precision,
    scale,
    ...other,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  });
};
