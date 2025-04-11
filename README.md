### Commission Fee Calculator

A Node.js application that calculates commission fees for financial transactions based on specified rules for cash-in and cash-out operations.
### Features

- Calculates commission fees for both cash-in and cash-out operations

- Different structures for natural and legal persons

- Weekly free limit for natural persons' cash-out transactions

- Currency rounding to the nearest cent (ceiling)

- Input validation and error handling


### Prerequisites

Before starting, check your Node.js version by running:

```bash
node -v 
```

If Node.js is not installed, download and install it from [Node.js official website](https://nodejs.org/).

### Installation

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/antony-m/comission-fee-calc
```

```bash
cd commission-fee-calc
```

```bash
npm i
```

### Environment Configuration

- Rename the `.env.example` file to `.env`.

- Change `API_BASE_URL` to your value.


### Usage

To run the application, execute the following command in the terminal:

```bash
npm start
```

### Running the Tests

Ensure the application functions as expected by running tests with:

```bash
npm test
```
