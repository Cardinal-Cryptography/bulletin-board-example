import React from 'react';
import styled from 'styled-components';

import { queries } from 'shared/layout';

const HeroHeadingWrapper = styled.div`
  margin-bottom: 76px;
  width: 518px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  & > h2 {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 700;
    font-size: 34px;
    line-height: 116%;
    letter-spacing: 0.025em;
  }

  & > p {
    color: ${({ theme }) => theme.colors.gray.medium};
    font-family: 'Karla';
    font-weight: 300;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.04em;
    text-align: center;
  }

  ${queries.tiny} {
    width: 100%;
  }
`;

type Variant = 'browse' | 'post' | 'another';

const HeroHeading = ({ variant }: { variant: Variant }) => (
  <>
    {variant === 'browse' && (
      <HeroHeadingWrapper>
        <h2>Browse</h2>
        <p>
          Browse already posted texts. Remember there's only one per user.
        </p>
      </HeroHeadingWrapper>
    )}
    {variant === 'post' && (
      <HeroHeadingWrapper>
      <h2>Post</h2>
      <p>
        Here you can post your own texts on chain. Remember to connect your wallet first!
      </p>
    </HeroHeadingWrapper>
    )}
    {variant === 'another' && (
      <HeroHeadingWrapper>
      <h2>This is h2 in HeroHeading</h2>
      <p>
        And some text.
      </p>
    </HeroHeadingWrapper>
    )}
  </>
);
export default HeroHeading;
