import {roundUpToCent, getWeekNumber, validateTransaction} from '../src/utils.js';

describe('Utility Functions', () => {
  describe('roundUpToCent', () => {
    it('rounds up to nearest cent', () => {
      expect(roundUpToCent(0.023)).toBe(0.03);
      expect(roundUpToCent(0.0200001)).toBe(0.03);
      expect(roundUpToCent(0.02)).toBe(0.02);
    });

    it('handles whole numbers', () => {
      expect(roundUpToCent(5)).toBe(5);
      expect(roundUpToCent(0)).toBe(0);
    });
  });

  describe('getWeekNumber', () => {
    it('returns correct ISO week format', () => {
      expect(getWeekNumber('2023-01-02')).toBe('2023-1');
      expect(getWeekNumber('2023-12-31')).toBe('2023-52');
    });
  });

  describe('validateTransaction', () => {
    const validTx = {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: {amount: 100, currency: 'EUR'}
    };

    it('accepts valid transaction', () => {
      expect(() => validateTransaction(validTx)).not.toThrow();
    });

    it('rejects missing required fields', () => {
      const {date, ...noDate} = validTx;
      expect(() => validateTransaction(noDate)).toThrow('Invalid transaction structure');
    });

    it('validates amount', () => {
      const invalidAmount = {...validTx, operation: {...validTx.operation, amount: -100}};
      expect(() => validateTransaction(invalidAmount)).toThrow('Invalid amount');
    });

    it('validates currency', () => {
      const invalidCurrency = {...validTx, operation: {...validTx.operation, currency: 'USD'}};
      expect(() => validateTransaction(invalidCurrency)).toThrow('Only EUR currency is supported');
    });
  });
});
