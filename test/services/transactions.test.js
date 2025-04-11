import {
  processTransactions,
  loadTransactionsFromFile,
  calculateAndDisplayFees
} from "../../src/services/transactions.js";
import {FeeCalculator} from "../../src/services/feeCalculator.js";
import {readFile} from "fs/promises";
import {validateTransaction} from "../../src/utils.js";


jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("../../src/utils.js");
jest.mock("../../src/services/feeCalculator.js");

describe('Transactions', () => {
  const mockTransactions = [
    {
      date: '2023-01-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: {amount: 200, currency: 'EUR'}
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    FeeCalculator.mockImplementation(() => ({
      calculateFee: jest.fn().mockResolvedValue(0.50)
    }));
  });

  describe('loadTransactionsFromFile', () => {
    it('should load and parse transactions from file', async () => {
      readFile.mockResolvedValue(JSON.stringify(mockTransactions));
      const result = await loadTransactionsFromFile('test.json');
      expect(result).toEqual(mockTransactions);
    });

    it('should throw error for missing file path', async () => {
      await expect(loadTransactionsFromFile()).rejects.toThrow('Input file path is required');
    });

    it('should throw error for invalid JSON', async () => {
      readFile.mockResolvedValue('invalid json');
      await expect(loadTransactionsFromFile('test.json')).rejects.toThrow('Failed to load transactions');
    });
  });

  describe('calculateAndDisplayFees', () => {
    it('should process valid transactions', async () => {
      validateTransaction.mockReturnValue(true);
      const results = await calculateAndDisplayFees(mockTransactions, new FeeCalculator());
      expect(results).toEqual(['0.50']);
    });

    it('should skip invalid transactions', async () => {
      validateTransaction.mockImplementationOnce(() => {
        throw new Error('Invalid')
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      });

      const results = await calculateAndDisplayFees(mockTransactions, new FeeCalculator());

      expect(results).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Skipping invalid transaction: Invalid');
      consoleSpy.mockRestore();
    });

    it('should handle null fees', async () => {
      const mockCalculator = new FeeCalculator();
      mockCalculator.calculateFee.mockResolvedValueOnce(null);

      const results = await calculateAndDisplayFees(mockTransactions, mockCalculator);
      expect(results).toEqual([]);
    });
  });

  describe('processTransactions', () => {
    it('should process file and return fees', async () => {
      readFile.mockResolvedValue(JSON.stringify(mockTransactions));
      const results = await processTransactions('test.json');
      expect(results).toEqual(['0.50']);
    });
  });
});
