import { ApiPromise } from '@polkadot/api';
import { BN, BN_ONE } from '@polkadot/util';
import type { WeightV2 } from '@polkadot/types/interfaces';

export const APP_NAME = 'Aleph Zero The Bulletin Board';

export const GAS_LIMIT_VALUE = 5 * 22361000000; // it was checked that gasRequired is 22361000000 for the press operation and no operation requires more gas, so it was multiplied times 5 for safety reasons

export const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

export function readOnlyGasLimit(api: ApiPromise): WeightV2 {
  return api.registry.createType('WeightV2', {
    refTime: new BN(1_000_000_000_000),
    proofSize: MAX_CALL_WEIGHT,
  }) as WeightV2;
}

export enum ErrorToastMessages {
  NO_WALLET = "You haven't connected your wallet. Your posts will NOT be saved.",
  NO_EXTENSION = 'Your browser does NOT HAVE the required plugin.',
  NO_ACCOUNT = 'You DO NOT possess an account tied to your wallet. Please create a new account or import an existing one.',
  ERROR_FETCHING_DATA = 'Error during fetching data.',
  ERROR_API_CONN = 'Error occured with API connection.',
  ERROR_CONTRACT_DATA = 'Error occured when setting up a contract.',
  CUSTOM = 'An error occured: ',
}
