import React from 'react';
import styled from 'styled-components';

import { queries } from 'shared/layout';

const Wrapper = styled.div`
  justify-self: end;

  .nav-mobile-button {
    display: block;
    position: relative;
    z-index: 10;
    width: 50px;
    height: 100%;
    margin: 0 -10px 0 0;
    padding: 0;
    border: 0;
    background: transparent;
    user-select: none;

    @include media-breakpoint-up(lg) {
      display: none;
    }

    span {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    &::before,
    &::after,
    span::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60%;
      height: 2px;
      background: ${({ theme }) => theme.colors.white};
      transform: translateX(-50%) translateY(-50%);
      transition: 0.4s all ease;
    }

    &::before {
      margin-top: -10px;
    }

    &::after {
      margin-top: 10px;
    }
  }

  &.is-triggered .nav-mobile-button {
    &::before {
      margin-top: 0;
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
    }

    &::after {
      margin-top: 0;
      transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    }

    span::before {
      width: 0;
    }
  }

  ${queries.tablet} {
    display: none;
  }
`;

interface HamburgerMenuIconProps {
  isOpen: boolean;
  onButtonClick: () => void;
}

const HamburgerMenuIcon = ({ isOpen, onButtonClick }: HamburgerMenuIconProps) => (
  <Wrapper className={isOpen ? 'is-triggered' : ''}>
    <button className="nav-mobile-button" type="button" onClick={onButtonClick}>
      <span>&nbsp;</span>
    </button>
  </Wrapper>
);

export default HamburgerMenuIcon;
