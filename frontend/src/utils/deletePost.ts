import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';

import { displayErrorToast, displaySuccessToast } from 'components/NotificationToast';

import { InjectedAccountWithMeta } from 'redux/slices/walletAccountsSlice';
import { ErrorToastMessages } from 'shared/constants';

import bulletinBoardMetadata from '../metadata/metadata_bulletin_board.json';
import addresses from '../metadata/addresses.json';
import { getGasLimit } from './dryRun';

export const deletePost = async (
  api: ApiPromise,
  loggedUser: InjectedAccountWithMeta,
  onSuccess: () => void
): Promise<void> => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(
    api,
    bulletinBoardMetadata,
    addresses.bulletin_board_address
  );
  const injector = await web3FromSource(loggedUser.meta.source);

  const gasLimitResult = await getGasLimit(api, loggedUser.address, 'delete', contract);

  if (gasLimitResult.ok) {
    const { value: gasLimit } = gasLimitResult;

    await contract.tx
      .delete({
        gasLimit,
      })
      .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
        events.forEach(({ event: { method } }) => {
          if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
            displaySuccessToast();
            onSuccess();
          } else if (method === 'ExtrinsicFailed') {
            const errorMessage = `${ErrorToastMessages.CUSTOM} ${method}.`;
            displayErrorToast(errorMessage);
          }
        });
      })
      .catch((error) => {
        displayErrorToast(`${ErrorToastMessages.CUSTOM} ${error}.`);
      });
  } else {
    console.log(gasLimitResult.error);
  }
};
