import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { WeightV2 } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';

import { displayErrorToast, displaySuccessToast } from 'components/NotificationToast';

import { InjectedAccountWithMeta } from 'redux/slices/walletAccountsSlice';
import { ErrorToastMessages } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';

const REF_TIME = 14361572382;
const PROOF_SIZE = 284124;

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

  const gasLimit = api.registry.createType('WeightV2', {
    refTime: new BN(REF_TIME).muln(2),
    proofSize: new BN(PROOF_SIZE).muln(2),
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
