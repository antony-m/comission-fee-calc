import {FeeCalculator} from "./feeCalculator.js";
import {readFile} from "fs/promises";
import {validateTransaction} from "../utils.js";

export async function processTransactions(inputFilePath) {
  const transactions = await loadTransactionsFromFile(inputFilePath);
  const feeCalculator = new FeeCalculator();

  return calculateAndDisplayFees(transactions, feeCalculator);
}

export async function loadTransactionsFromFile(filePath) {
  if (!filePath) {
    throw new Error('Input file path is required');
  }

  try {
    const fileContent = await readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Failed to load transactions: ${error.message}`);
  }
}

export async function calculateAndDisplayFees(transactions, feeCalculator) {
  const results = [];

  for (const transaction of transactions) {
    try {
      validateTransaction(transaction);
      const fee = await feeCalculator.calculateFee(transaction);
      if (fee != null) {
        results.push(fee.toFixed(2));
      }
    } catch (error) {
      console.error(`Skipping invalid transaction: ${error.message}`);
    }
  }

  return results;
}
