import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';
import type { WeightV2 } from '@polkadot/types/interfaces';
import BN from 'bn.js';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, GAS_LIMIT_VALUE } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { sleep } from './sleep';

export type PostByAccount = {
  author: string;
  postedAt: number;
  expiresAt: number;
  text: string;
};

export const getPostByAccount = async (
  accountId: string,
  api: ApiPromise | null
): Promise<PostByAccount | null> => {
  await sleep(500);
  if (api === null) {
    displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
    return null;
  }
  const gasLimit = api.registry.createType('WeightV2', {
    refTime: new BN('10000000000'),
    proofSize: new BN('10000000000'),
  }) as WeightV2;
  const contract = new ContractPromise(api, bulletinBoardMetadata, addresses.bulletin_board);
  const { result, output } = await contract.query.getByAccount(
    contract.address,
    {
      gasLimit,
    },
    accountId
  );
  if (result.isOk && output) {
    return output.toHuman() as PostByAccount;
  }
  if (result.isErr) {
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return null;
};
