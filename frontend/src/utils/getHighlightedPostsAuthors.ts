import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, GAS_LIMIT_VALUE } from 'shared/constants';

import highlightedPostsMetadata from '../metadata/metadata_highlighted_posts.json';
import addresses from '../metadata/addresses.json';

export const getHighlightedPostsAuthors = async (
  api: ApiPromise | null
): Promise<string[] | null> => {
  if (api === null) {
    displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
    return null;
  }
  const contract = new ContractPromise(api, highlightedPostsMetadata, addresses.highlighted_posts);
  const { result, output } = await contract.query.highlightedPosts(contract.address, {
    gasLimit: GAS_LIMIT_VALUE,
  });
  if (result.isOk && output) {
    return output.toHuman() as string[];
  }
  if (result.isErr) {
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return null;
};
