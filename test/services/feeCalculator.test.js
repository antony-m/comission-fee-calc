import {FeeCalculator} from '../../src/services/feeCalculator.js';

jest.mock('../../src/api/apiConfig.js', () => ({
  getCashInConfig: jest.fn(),
  getCashOutNaturalConfig: jest.fn(),
  getCashOutJuridicalConfig: jest.fn(),
}));

jest.mock('../../src/utils.js', () => ({
  roundUpToCent: jest.fn((amount) => amount),
  getWeekNumber: jest.fn().mockReturnValue('2023-1'),
}));

describe('FeeCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new FeeCalculator();
    jest.clearAllMocks();
  });

  const mockApiConfig = (configType, config) => {
    const apiConfig = require('../../src/api/apiConfig.js');
    apiConfig[configType].mockResolvedValue(config);
  };

  describe('calculateCashIn', () => {
    const cashInConfig = {percents: 0.03, max: {amount: 5}};

    beforeEach(() => {
      mockApiConfig('getCashInConfig', cashInConfig);
    });

    it('should calculate fee correctly', async () => {
      const fee = await calculator.calculateCashIn(100);
      expect(fee).toBe(0.03);
    });

    it('should not exceed max fee', async () => {
      const fee = await calculator.calculateCashIn(20000);
      expect(fee).toBe(5);
    });
  });

  describe('calculateCashOutNatural', () => {
    const cashOutNaturalConfig = {percents: 0.3, week_limit: {amount: 1000}};

    beforeEach(() => {
      mockApiConfig('getCashOutNaturalConfig', cashOutNaturalConfig);
    });

    it('should not charge fee below weekly limit', async () => {
      const fee = await calculator.calculateCashOutNatural(1, '2023-01-01', 500);
      expect(fee).toBe(0);
    });

    it('should charge fee only on amount exceeding limit', async () => {
      await calculator.calculateCashOutNatural(1, '2023-01-01', 500);
      const fee = await calculator.calculateCashOutNatural(1, '2023-01-02', 600);
      expect(fee).toBe(0.3);
    });
  });

  describe('calculateCashOutJuridical', () => {
    const cashOutJuridicalConfig = {percents: 0.3, min: {amount: 0.5}};

    beforeEach(() => {
      mockApiConfig('getCashOutJuridicalConfig', cashOutJuridicalConfig);
    });

    it('should calculate fee correctly', async () => {
      const fee = await calculator.calculateCashOutJuridical(100);
      expect(fee).toBe(0.5); // Minimum fee applies
    });
  });

  describe('calculateFee', () => {
    it('should route cash_in transactions correctly', async () => {
      jest.spyOn(calculator, 'calculateCashIn').mockResolvedValue(0.5);
      const transaction = {
        type: 'cash_in',
        operation: {amount: 100},
      };

      const fee = await calculator.calculateFee(transaction);
      expect(fee).toBe(0.5);
    });

    it('should route cash_out transactions correctly', async () => {
      jest.spyOn(calculator, 'calculateCashOutNatural').mockResolvedValue(0.3);
      const transaction = {
        type: 'cash_out',
        user_type: 'natural',
        user_id: 1,
        date: '2023-01-01',
        operation: {amount: 100},
      };

      const fee = await calculator.calculateFee(transaction);
      expect(fee).toBe(0.3);
    });
  });
});
