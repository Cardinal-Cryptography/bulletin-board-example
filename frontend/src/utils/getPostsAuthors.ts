import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, GAS_LIMIT_VALUE } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';

export const getPostsAuthors = async (api: ApiPromise | null): Promise<string[] | null> => {
  if (api === null) {
    displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
    return null;
  }
  const contract = new ContractPromise(api, bulletinBoardMetadata, addresses.bulletin_board);
  const { result, output } = await contract.query.getPostsAuthors(contract.address, {
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
