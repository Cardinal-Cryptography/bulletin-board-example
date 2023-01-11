import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { WeightV2 } from '@polkadot/types/interfaces';
import BN from 'bn.js';

import { displayErrorToast, displaySuccessToast } from 'components/NotificationToast';

import { InjectedAccountWithMeta } from 'redux/slices/walletAccountsSlice';
import { ErrorToastMessages, GAS_LIMIT_VALUE } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { sleep } from './sleep';

export const sendPost = async (
  expiresAfter: number,
  postText: string,
  totalPrice: number,
  api: ApiPromise | null,
  loggedUser: InjectedAccountWithMeta
): Promise<void> => {
  await sleep(500);
  if (api === null) {
    displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
    return;
  }
  if (!loggedUser.meta.source) return;
  const contract = new ContractPromise(api, bulletinBoardMetadata, addresses.bulletin_board);
  const injector = await web3FromSource(loggedUser.meta.source);
  const gasLimit = api.registry.createType('WeightV2', {
    refTime: new BN('10000000000'),
    proofSize: new BN('10000000000'),
  }) as WeightV2;
  await contract.tx
    .post(
      {
        gasLimit,
        value: totalPrice,
      },
      expiresAfter,
      postText
    )
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event: { method } }) => {
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
