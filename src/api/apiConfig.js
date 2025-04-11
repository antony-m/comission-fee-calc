import axios from "axios";
import {CASH_IN_URL, CASH_OUT_LEGAL_URL, CASH_OUT_NATURAL_URL} from "./constants.js";

const configCache = {};

async function getConfig(url) {
  if (configCache[url]) {
    return configCache[url];
  }

  try {
    const response = await axios.get(url);
    configCache[url] = response.data;

    return configCache[url];
  } catch (error) {
    console.error('Failed to fetch config:', error.message);

    if (configCache[url]) {
      return configCache[url];
    }
  }
}

export async function getCashInConfig() {
  return getConfig(CASH_IN_URL);
}

export async function getCashOutNaturalConfig() {
  return getConfig(CASH_OUT_NATURAL_URL);
}

export async function getCashOutJuridicalConfig() {
  return getConfig(CASH_OUT_LEGAL_URL);
}
