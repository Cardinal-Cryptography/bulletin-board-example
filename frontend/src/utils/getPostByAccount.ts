import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, readOnlyGasLimit } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { getDataFromOutput } from './getDataFromOutput';

export type PostByAccount = {
  author: string;
  postedAt: number;
  expiresAt: number;
  text: string;
};

export const getPostByAccount = async (
  accountId: string,
  api: ApiPromise
): Promise<PostByAccount | null> => {
  let data = null;
  const gasLimit = readOnlyGasLimit(api);

  const contract = new ContractPromise(
    api,
    bulletinBoardMetadata,
    addresses.bulletin_board_address
  );

  const { result, output } = await contract.query.getByAccount(
    contract.address,
    {
      gasLimit,
    },
    accountId
  );
  if (result.isOk && output) {
    data = getDataFromOutput<PostByAccount>(output.toHuman());
  }
  if (result.isErr) {
    console.log(result.toHuman());
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return data;
};
