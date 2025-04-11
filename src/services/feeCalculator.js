import { roundUpToCent, getWeekNumber } from '../utils.js';
import {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig
} from '../api/apiConfig.js';

export class FeeCalculator {
  constructor() {
    this.userWeeklyTotals = new Map();
  }

  async calculateCashIn(amount) {
    try {
      const config = await getCashInConfig();
      const fee = Math.min(amount * config.percents / 100, config.max.amount);
      return roundUpToCent(fee);
    } catch (e) {
      console.error('Failed to calculate Cash In');
    }
  }

  async calculateCashOutNatural(userId, date, amount) {
    try {
      const config = await getCashOutNaturalConfig();
      const weekKey = `${userId}-${getWeekNumber(date)}`;

      let weeklyTotal = this.userWeeklyTotals.get(weekKey) || 0;
      let taxableAmount;

      if (weeklyTotal < config.week_limit.amount) {
        const remainingFreeAmount = config.week_limit.amount - weeklyTotal;
        taxableAmount = Math.max(0, amount - remainingFreeAmount);
        weeklyTotal += amount;
      } else {
        taxableAmount = amount;
      }

      this.userWeeklyTotals.set(weekKey, weeklyTotal);
      const fee = taxableAmount * config.percents / 100;
      return roundUpToCent(fee);
    } catch (e) {
      console.error('Failed to calculate Cash Out Natural');
    }
  }

  async calculateCashOutJuridical(amount) {
    try {
      const config = await getCashOutJuridicalConfig();
      const fee = Math.max(amount * config.percents / 100, config.min.amount);
      return roundUpToCent(fee);
    } catch (e) {
      console.error('Failed to calculate Cash Out Juridical');
    }
  }

  async calculateFee(transaction) {
    switch (transaction.type) {
      case 'cash_in':
        return this.calculateCashIn(transaction.operation.amount);
      case 'cash_out':
        if (transaction.user_type === 'natural') {
          return this.calculateCashOutNatural(
            transaction.user_id,
            transaction.date,
            transaction.operation.amount
          );
        } else {
          return this.calculateCashOutJuridical(transaction.operation.amount);
        }
      default:
        throw new Error(`Unknown transaction type: ${transaction.type}`);
    }
  }
}
