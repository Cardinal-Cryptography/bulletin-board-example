import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from 'redux/store';
import getWalletAddressShort from 'utils/getWalletAddressShort';

const HighlightsRowStyling = styled.div`
  height: 100%;
  padding: 0 16px;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.04em;
  border-radius: 2px;
  display: grid;
  align-items: center;
  grid-template-columns: 48px 1fr;

  &.board-row-user {
    height: auto;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }

  &:nth-of-type(odd) {
    background: ${({ theme }) => theme.colors.night[150]};
  }
  & > .board-number {
    font-weight: 500;
  }
`;

interface HighlightsRowProps {
  author: string;
  text: string;
  position: number;
  // id: number;
}

// Highlights the row with a solid border of primary color (see `HighlightsRowStyling` for more details)
// if `walletAddress === author`.
const HighlightsRow = ({ author, position, text }: HighlightsRowProps) => {
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);

  return (
    <HighlightsRowStyling
      key={author}
      className={`board-row ${
        loggedAccount && author === loggedAccount.address ? 'board-row-user' : ''
      }`}
    >
      {position && <p className="board-number">{position}.</p>}
      <div>
        <p>{getWalletAddressShort(author)}</p>
        <p>{text}</p>
        {/* <p>{id}</p> */}
      </div>
    </HighlightsRowStyling>
  );
};

export default HighlightsRow;
