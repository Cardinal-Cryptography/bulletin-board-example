import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';
import { ContractOptions } from '@polkadot/api-contract/types';

import { displayErrorToast, displaySuccessToast } from 'components/NotificationToast';

import { InjectedAccountWithMeta } from 'redux/slices/walletAccountsSlice';
import { ErrorToastMessages } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { getGasLimit } from './dryRun';

export const sendPost = async (
  expiresAfter: number,
  postText: string,
  totalPrice: number,
  api: ApiPromise,
  loggedUser: InjectedAccountWithMeta
): Promise<void> => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(
    api,
    bulletinBoardMetadata,
    addresses.bulletin_board_address
  );

  const injector = await web3FromSource(loggedUser.meta.source);

  const options: ContractOptions = {
    value: totalPrice,
  };
  const gasLimit = await getGasLimit(api, loggedUser.address, 'post', contract, options, [
    expiresAfter,
    postText,
  ]);

  await contract.tx
    .post(
      {
        value: totalPrice,
        gasLimit,
      },
      expiresAfter,
      postText
    )
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          displaySuccessToast();
        } else if (method === 'ExtrinsicFailed') {
          displayErrorToast(`${ErrorToastMessages.CUSTOM} ${method}.`);
        }
      });
    })
    .catch((error) => {
      displayErrorToast(`${ErrorToastMessages.CUSTOM} ${error}.`);
    });
};
