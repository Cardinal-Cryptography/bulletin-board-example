import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import HamburgerMenuIcon from 'components/HamburgerMenuIcon';
import WalletButton from 'components/Wallet/WalletButton';

import { queries } from 'shared/layout';
import { ReactComponent as Icon } from 'assets/AlephZeroLogo.svg';
import { ReactComponent as IconLetter } from 'assets/AlephLetterLogo.svg';

const NavBar = styled.nav`
  height: 64px;
  width: calc(100% - 48px);
  padding: 0 24px;
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  align-items: center;

  .logo {
    display: none;
  }

  .logo-mobile {
    display: block;
    height: 28px;
    width: auto;
    margin-left: 0;
  }

  ${queries.tablet} {
    height: 88px;
    width: 100%;
    padding: 0;

    .logo {
      margin-left: 32px;
      display: flex;
      align-items: flex-start;
    }

    .logo-mobile {
      display: none;
    }
  }
`;

const NavlinksWrapper = styled.div`
  display: none;
  gap: 56px;
  justify-content: center;
  align-items: center;

  & > a {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
    font-size: 16px;
    line-height: 135%;
    letter-spacing: 0.05em;
  }

  ${queries.tablet} {
    display: flex;
  }
`;

const MenuMobile = styled.nav`
  width: 100vw;
  height: calc(100vh - 64px);
  top: 64px;
  background-color: ${({ theme }) => theme.colors.night[100]};
  z-index: 30;
  position: fixed;
  margin-left: -24px;
  padding-top: 74px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
  transition: top 0.5s ease-out;

  &.closed {
    top: -150vh;
  }

  & > a {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
    font-size: 16px;
    line-height: 21.6px;
    letter-spacing: 0.05;
  }
`;

export interface NavbarProps {
  setIsAccountsModalVisible: () => void;
  loggedAccountAddress?: string;
}

const NavLinks = (): JSX.Element => (
  <>
    <Link to="/browse">Browse</Link>
    <Link to="/post">Post</Link>
    <Link to="/another">Another link `NavLinks` component</Link>
  </>
);

const Navbar = ({ setIsAccountsModalVisible, loggedAccountAddress }: NavbarProps): JSX.Element => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const onMobileBtnClick = () => {
    setIsMobileNavOpen(() => !isMobileNavOpen);
  };

  const onSetMobileNavClosed = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <NavBar>
      <Icon className="logo" />
      <IconLetter className="logo-mobile" />
      <NavlinksWrapper>
        <NavLinks />
      </NavlinksWrapper>
      <WalletButton
        setIsAccountsModalVisible={setIsAccountsModalVisible}
        setIsMobileNavClosed={onSetMobileNavClosed}
        loggedAccountAddress={loggedAccountAddress}
      />
      <HamburgerMenuIcon onButtonClick={onMobileBtnClick} isOpen={isMobileNavOpen} />
      <MenuMobile className={isMobileNavOpen ? 'open' : 'closed'}>
        <NavLinks />
      </MenuMobile>
    </NavBar>
  );
};

export default Navbar;
