import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Icon } from 'assets/Close.svg';

const ProgressCircleWrapper = styled.div`
  width: 28px;
  height: 28px;
  position: relative;
  display: flex;
  justify-content: flex-end;

  .icon {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  svg {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle-background {
    fill: none;
    stroke-width: 1.5px;
    opacity: 0.1;
    stroke: ${({ theme }) => theme.colors.background};
  }

  .progress-circle {
    /* 75.4px -> circumference of circle with radius of 12px */
    stroke-dasharray: 75.4px;
    stroke-dashoffset: 0px;
    stroke: ${({ theme }) => theme.colors.background};
    animation: progress 5.5s linear;
    fill: none;
    stroke-width: 1.5px;
    stroke-linecap: butt;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  @keyframes progress {
    from {
      stroke-dashoffset: 75.4px;
    }
    to {
      stroke-dashoffset: 0px;
    }
  }
`;

const ProgressCircle = (): JSX.Element => (
  <ProgressCircleWrapper>
    <svg>
      <circle className="circle-background" cx="14" cy="14" r="12" />
      <circle className="progress-circle" cx="14" cy="14" r="12" />
    </svg>
    <Icon className="icon" />
  </ProgressCircleWrapper>
);

export default ProgressCircle;
