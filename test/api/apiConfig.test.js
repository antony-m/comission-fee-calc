import axios from 'axios';
import {getCashInConfig, getCashOutJuridicalConfig, getCashOutNaturalConfig} from '../../src/api/apiConfig.js';

jest.mock('axios');

describe('Config Service', () => {
  const mockConfig = {"percents": 0.03, "max": {"amount": 5, "currency": "EUR"}};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call correct URLs for each config type', async () => {
    axios.get.mockResolvedValue({data: mockConfig});

    await getCashInConfig();
    await getCashOutNaturalConfig();
    await getCashOutJuridicalConfig();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('cash-in'));
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('cash-out-natural'));
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('cash-out-juridical'));
  });

  it('should fetch cash-in config', async () => {
    axios.get.mockResolvedValue({data: mockConfig});
    const result = await getCashInConfig();
    expect(result).toEqual(mockConfig);
  });

  it('should return cached config on subsequent calls', async () => {
    axios.get.mockResolvedValueOnce({data: mockConfig});

    const result = await getCashInConfig();

    expect(result).toEqual(mockConfig);
    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it('should use cached config when API fails', async () => {
    axios.get.mockResolvedValueOnce({data: mockConfig});
    await getCashInConfig();

    axios.get.mockRejectedValueOnce(new Error('API error'));
    const result = await getCashInConfig();

    expect(result).toEqual(mockConfig);
  });
});
