import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import { displayErrorToast } from 'components/NotificationToast';

import { queries } from 'shared/layout';
import { ReactComponent as WalletIcon } from 'assets/WalletIcon.svg';
import {
  connectWallet,
  disconnectWallet,
  updateAllAccounts,
} from 'redux/slices/walletAccountsSlice';
import { ErrorToastMessages, APP_NAME } from 'shared/constants/index';
import getWalletAddressShort from 'utils/getWalletAddressShort';
import { ReactComponent as ChevronDownIcon } from 'assets/ChevronDown.svg';

import { RootState } from '../../../redux/store';

const WalletButtonStyling = styled.button`
  height: 36px;
  width: max-content;
  color: ${({ theme }) => theme.colors.primaryDarker};
  background: ${({ theme }) => theme.colors.button.secondary};
  border-radius: 18px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8.5px 16px;
  gap: 8px;
  justify-self: end;
  position: relative;
  transition: background-color 0.4s ease, opacity 0.4s ease;
  will-change: background-color, opacity;
  justify-self: center;

  &:hover {
    background: ${({ theme }) => theme.colors.button.secondaryHover};
  }

  & span {
    font-weight: 500;
    font-size: 14px;
    line-height: 135%;

    display: flex;
    align-items: center;
    letter-spacing: 0.06em;
  }

  & .button-content-logged {
    display: flex;
  }

  & .button-content-separator {
    width: 1px;
    background-color: ${({ theme }) => theme.colors.background};
    margin: 0 4px 0 8px;
  }

  .button-icon {
    width: 16px;
    height: 16px;
  }

  ${queries.tablet} {
    margin-right: 28px;
    justify-self: end;
  }
`;

const NavbarButtonContent = ({
  loggedAccountAddress,
}: {
  loggedAccountAddress?: string;
}): JSX.Element => {
  if (!loggedAccountAddress) {
    return <span>Connect Wallet</span>;
  }
  return (
    <div className="button-content-logged">
      <span>{getWalletAddressShort(loggedAccountAddress)}</span>
      <div className="button-content-separator" />
      <ChevronDownIcon />
    </div>
  );
};

const ButtonTooltip = styled.div`
  width: min-content;
  min-width: calc(100% - 60px);
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 500;
  line-height: 135%;
  background-color: ${({ theme }) => theme.colors.night[250]};
  text-align: center;
  padding: 10px 12px;
  border-radius: 2px 2px 0px 0px;
  position: absolute;
  bottom: calc(-100% - 20px);

  &::after {
    content: ' ';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent ${({ theme }) => theme.colors.night[250]} transparent;
  }

  ${queries.desktop} {
    padding: 30px 32px;
    bottom: calc(-100% - 64px);
  }
`;

export interface WalletButtonProps {
  setIsAccountsModalVisible: () => void;
  setIsMobileNavClosed: () => void;
  loggedAccountAddress?: string;
}

const WalletButton = ({
  setIsAccountsModalVisible,
  setIsMobileNavClosed,
  loggedAccountAddress,
}: WalletButtonProps): JSX.Element => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const pluginTextWithLink = useMemo(
    () => (
      <span>
        {ErrorToastMessages.NO_EXTENSION} The plugin can be found&nbsp;
        <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
          <span className="message-link">here</span>.
        </a>
      </span>
    ),
    []
  );

  const enableExtension = useCallback(async () => {
    const extension = await web3Enable(APP_NAME);
    const isExtensionExists = extension.length === 0;
    if (isExtensionExists) {
      displayErrorToast(pluginTextWithLink);
      console.error(ErrorToastMessages.NO_EXTENSION);
    }
    return isExtensionExists;
  }, [pluginTextWithLink]);

  const walletExtensionSetup = async (): Promise<void> => {
    if (await enableExtension()) return;
    const accounts = await web3Accounts();
    dispatch(updateAllAccounts(accounts));

    if (accounts.length === 1) {
      dispatch(connectWallet(accounts[0]));
    } else if (!accounts.length) {
      displayErrorToast(ErrorToastMessages.NO_ACCOUNT);
    } else {
      setIsAccountsModalVisible();
    }
  };

  useEffect(() => {
    if (loggedAccountAddress) enableExtension();
  }, [enableExtension, loggedAccountAddress]);

  const handleClick = () => {
    if (!loggedAccountAddress) {
      walletExtensionSetup();
    } else {
      setIsTooltipOpen(!isTooltipOpen);
    }
    setIsMobileNavClosed();
  };

  return (
    <WalletButtonStyling onClick={handleClick}>
      <WalletIcon className="button-icon" />
      <NavbarButtonContent loggedAccountAddress={loggedAccountAddress} />
      {isTooltipOpen && (
        <ButtonTooltip className="tooltip" onClick={() => dispatch(disconnectWallet())}>
          Disconnect
        </ButtonTooltip>
      )}
    </WalletButtonStyling>
  );
};

export default WalletButton;
