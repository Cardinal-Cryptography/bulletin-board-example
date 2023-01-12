import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, readOnlyGasLimit } from 'shared/constants';

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
  // For read-only calls we don't need the estimate as we won't be charged anything.
  const gasLimit = readOnlyGasLimit(api);

  const contract = new ContractPromise(
    api,
    highlightedPostsMetadata,
    addresses.highlighted_posts_address
  );
  const { result, output } = await contract.query.highlightedPosts(contract.address, {
    gasLimit,
  });
  if (result.isOk && output) {
    return output.toHuman() as string[];
  }
  if (result.isErr) {
    console.log(result.toHuman());
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return null;
};
