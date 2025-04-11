import {processTransactions} from "./src/services/transactions.js";

async function main() {
  try {
    const [,, inputFilePath] = process.argv;
    const feeResults = await processTransactions(inputFilePath);

    feeResults.forEach(result => console.log(result));
  } catch (error) {
    console.error(`Application error: ${error.message}`);
    process.exit(1);
  }
}

main();
