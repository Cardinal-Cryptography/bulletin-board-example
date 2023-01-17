import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';

import { displayErrorToast } from 'components/NotificationToast';

import { ErrorToastMessages, readOnlyGasLimit } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { getDataFromOutput } from './getDataFromOutput';

export const getHighlightPricePerBlock = async (api: ApiPromise): Promise<number | null> => {
  let data = null;
  const gasLimit = readOnlyGasLimit(api);

  const contract = new ContractPromise(
    api,
    bulletinBoardMetadata,
    addresses.bulletin_board_address
  );
  const { result, output } = await contract.query.getHighlightPricePerBlock(contract.address, {
    gasLimit,
  });

  if (result.isOk && output) {
    data = Number(getDataFromOutput<string[]>(output.toHuman()));
  }
  if (result.isErr) {
    console.log(result.toHuman());
    displayErrorToast(ErrorToastMessages.ERROR_FETCHING_DATA);
  }
  return data;
};
