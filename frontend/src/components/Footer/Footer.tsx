import React from 'react';
import styled from 'styled-components';

import { queries } from 'shared/layout';

const FooterContainer = styled.div`
  height: 88px;
  max-width: 1176px;
  width: 100%;
  justify-self: center;
  grid-column: 1 / span 12;
  color: ${({ theme }) => theme.colors.gray.medium};
  font-size: 14px;
  line-height: 16.8px;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.night[300]};

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${queries.tiny} {
    height: 118px;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }
`;

const FooterLeftContainer = styled.div`
  font-weight: 500;
  letter-spacing: 0.07em;
`;

const FooterRightContainer = styled.div`
  display: flex;
  gap: 24px;
  font-weight: 400;
`;

const FooterLink = styled.a`
  cursor: pointer;
  transition: color 0.4s ease;
  will-change: color;
  text-decoration: none;

  &:visited,
  &:link {
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer = (): JSX.Element => (
  <FooterContainer>
    <FooterLeftContainer>
      <p>Aleph Zero Foundation &copy; 2018-{new Date().getFullYear()}</p>
    </FooterLeftContainer>
    <FooterRightContainer>
      <FooterLink href="https://alephzero.org/privacy-policy/" target="_blank">
        Privacy Policy
      </FooterLink>
      <FooterLink href="https://alephzero.org/cookies-policy/" target="_blank">
        Cookies Policy
      </FooterLink>
    </FooterRightContainer>
  </FooterContainer>
);

const MemoizedFooter = React.memo(Footer);

export default MemoizedFooter;
