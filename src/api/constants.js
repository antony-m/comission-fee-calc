import 'dotenv/config';

export const CASH_IN_URL = `${process.env.API_BASE_URL}/tasks/api/cash-in`;
export const CASH_OUT_NATURAL_URL = `${process.env.API_BASE_URL}/tasks/api/cash-out-natural`;
export const CASH_OUT_LEGAL_URL= `${process.env.API_BASE_URL}/tasks/api/cash-out-juridical`;

