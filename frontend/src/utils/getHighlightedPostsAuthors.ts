import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';
import type { WeightV2 } from '@polkadot/types/interfaces';
import BN from 'bn.js';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, GAS_LIMIT_VALUE } from 'shared/constants';

import highlightedPostsMetadata from '../metadata/metadata_highlighted_posts.json';
import addresses from '../metadata/addresses.json';
import { sleep } from './sleep';

export const getHighlightedPostsAuthors = async (
  api: ApiPromise | null
): Promise<string[] | null> => {
  await sleep(500);
  if (api === null) {
    displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
    return null;
  }
  const gasLimit = api.registry.createType('WeightV2', {
    refTime: new BN('10000000000'),
    proofSize: new BN('10000000000'),
  }) as WeightV2;
  const contract = new ContractPromise(api, highlightedPostsMetadata, addresses.highlighted_posts_address);
  const { result, output } = await contract.query.highlightedPosts(contract.address, {
    gasLimit,
  });
  if (result.isOk && output) {
    return output.toHuman() as string[];
  }
  if (result.isErr) {
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return null;
};
