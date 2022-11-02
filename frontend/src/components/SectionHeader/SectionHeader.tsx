import React from 'react';
import styled from 'styled-components';

const HeadingContainer = styled.div`
  height: 28px;
  width: max-content;
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid ${({ theme }) => theme.colors.primary};

  .heading {
    margin: 0;
    margin-left: 16px;
    font-size: 24px;
    line-height: 28px;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 700;
    letter-spacing: 0.03em;

    & span {
      font-weight: 300;
    }
  }
`;

export interface SectionHeaderProps {
  children: React.ReactNode;
}

const SectionHeader = ({ children }: SectionHeaderProps): JSX.Element => (
  <HeadingContainer>
    <h2 className="heading">{children}</h2>
  </HeadingContainer>
);

const MemoizedSectionHeader = React.memo(SectionHeader);

export default MemoizedSectionHeader;
