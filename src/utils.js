import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear.js';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

export function roundUpToCent(amount) {
  return Math.ceil(amount * 100) / 100;
}

export function getWeekNumber(date) {
  const d = dayjs(date);
  return `${d.year()}-${d.isoWeek()}`;
}

export function validateTransaction(transaction) {
  if (!transaction.date || !transaction.user_id || !transaction.user_type || !transaction.type || !transaction.operation) {
    throw new Error('Invalid transaction structure');
  }
  if (isNaN(transaction.operation.amount) || transaction.operation.amount < 0) {
    throw new Error('Invalid amount');
  }
  if (transaction.operation.currency !== 'EUR') {
    throw new Error('Only EUR currency is supported');
  }
  if (!dayjs(transaction.date).isValid()) {
    throw new Error('Invalid date format');
  }
}
