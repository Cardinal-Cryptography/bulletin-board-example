import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, readOnlyGasLimit } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { getDataFromOutput } from './getDataFromOutput';

export const getPostsAuthors = async (api: ApiPromise): Promise<string[] | null> => {
  let data = null;
  const gasLimit = readOnlyGasLimit(api);

  const contract = new ContractPromise(
    api,
    bulletinBoardMetadata,
    addresses.bulletin_board_address
  );

  const { result, output } = await contract.query.getPostsAuthors(contract.address, {
    gasLimit,
  });

  if (result.isOk && output) {
    data = getDataFromOutput<string[]>(output.toHuman());
  }

  if (result.isErr) {
    console.log(result.toHuman());
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return data;
};
