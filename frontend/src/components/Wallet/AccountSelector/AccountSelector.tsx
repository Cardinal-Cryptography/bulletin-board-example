import React from 'react';
import styled from 'styled-components';

import { ReactComponent as TabStripe } from 'assets/TabStripe.svg';
import { ReactComponent as WalletIcon } from 'assets/Wallet.svg';
import { ReactComponent as CloseIcon } from 'assets/CloseModal.svg';
import { ReactComponent as Checkmark } from 'assets/CheckmarkGreen.svg';
import { queries } from 'shared/layout';
import getWalletAddressShort from 'utils/getWalletAddressShort';
import { InjectedAccountWithMeta } from 'redux/slices/walletAccountsSlice';

const AccountSelectorWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  margin-left: -24px;
  margin-top: -24px;
  background-color: ${({ theme }) => theme.colors.backgroundDimmed};
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ${queries.tiny} {
    margin-top: -24px;
  }
`;

const AccountSelectorContainer = styled.div`
  height: 472px;
  max-height: 100%;
  width: 378px;
  border-radius: 2px;
  display: grid;
  grid-template-rows: max-content 1fr;
  background-color: ${({ theme }) => theme.colors.night[150]};

  ${queries.tiny} {
    max-width: 100%;
  }
`;

const AccountSelectorHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .close-button {
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    margin: 15px 24px 0 0;
  }
`;

const AccountSelectorContent = styled.div`
  color: ${({ theme }) => theme.colors.white};
  padding: 32px;
  padding-bottom: 40px;
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: 40px;
  overflow-y: auto;

  & > div {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  & > h3 {
    font-weight: 300;
    font-size: 20px;
    line-height: 120%;
    text-align: center;
    letter-spacing: 0.035em;
  }
`;

const AccountSelectorTile = styled.div`
  min-height: 40px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.night[150]};
  border: 1px solid ${({ theme }) => theme.colors.night[300]};
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  will-change: background-color, gap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.night[200]};
    gap: 8px;

    .tile-checkmark {
      transition: all 0.2s ease-out;
      will-change: opacity;
      opacity: 1;
    }
  }

  .icon-container {
    height: 40px;
    width: 40px;
    border: 1px solid ${({ theme }) => theme.colors.night[350]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tile-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    letter-spacing: 0.07em;

    & > h5 {
      font-weight: 500;
      line-height: 120%;
    }

    & > p {
      color: ${({ theme }) => theme.colors.gray.medium};
      font-family: 'Karla';
      font-weight: 300;
      line-height: 150%;
    }
  }

  .tile-checkmark {
    margin-left: auto;
    opacity: 0;
  }
`;

export interface AccountTileProps {
  account: InjectedAccountWithMeta;
  onAccountClick: (account: InjectedAccountWithMeta) => void;
}

export interface AccountSelectorProps {
  accounts: InjectedAccountWithMeta[];
  onAccountSelection: (account: InjectedAccountWithMeta) => void;
  onModalClose: () => void;
}

const AccountTile = ({ account, onAccountClick }: AccountTileProps): JSX.Element => (
  <AccountSelectorTile onClick={() => onAccountClick(account)}>
    <div className="icon-container">
      <WalletIcon />
    </div>
    <div className="tile-data">
      <h5>{account.meta.name}</h5>
      <p>{getWalletAddressShort(account.address, 5)}</p>
    </div>
    <Checkmark className="tile-checkmark" />
  </AccountSelectorTile>
);

/// Modal presenting with a list of available accounts in Parity signer extension.
const AccountSelector = ({
  accounts,
  onAccountSelection,
  onModalClose,
}: AccountSelectorProps): JSX.Element => (
  <AccountSelectorWrapper>
    <AccountSelectorContainer>
      <AccountSelectorHeading>
        <button type="button" className="close-button" onClick={onModalClose}>
          <CloseIcon />
        </button>
        <TabStripe />
      </AccountSelectorHeading>
      <AccountSelectorContent>
        <h3>Choose which account you want to use</h3>
        <div>
          {accounts.map((account) => (
            <AccountTile
              account={account}
              onAccountClick={() => onAccountSelection(account)}
              key={account.address}
            />
          ))}
        </div>
      </AccountSelectorContent>
    </AccountSelectorContainer>
  </AccountSelectorWrapper>
);

export default AccountSelector;
