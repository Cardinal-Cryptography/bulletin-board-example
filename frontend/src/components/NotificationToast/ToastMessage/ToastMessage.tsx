import React from 'react';
import styled from 'styled-components';

import ProgressCircle from 'components/NotificationToast/ToastMessage/ProgressCircle';

import { ReactComponent as SuccessIcon } from 'assets/Checkmark.svg';
import { ReactComponent as WarningIcon } from 'assets/Warning.svg';
import { ReactComponent as ErrorIcon } from 'assets/Critical.svg';

const ToastWrapper = styled.div`
  height: 100%;
  padding: 16px;
  display: grid;
  gap: 13px;
  grid-template-columns: max-content 1fr max-content;

  & > button {
    height: 28px;
    width: 28px;
    background-color: transparent;
  }

  &.toast-success {
    background-color: ${({ theme }) => theme.colors.success};
  }

  &.toast-warning {
    background-color: ${({ theme }) => theme.colors.warning};
  }

  &.toast-error {
    background-color: ${({ theme }) => theme.colors.error};
  }

  &.single-line-message {
    align-items: center;
  }
`;

const ToastMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  letter-spacing: 0.07em;

  & > h4 {
    font-family: 'Gilroy';
    font-weight: 500;
    line-height: 120%;
  }

  & > p {
    font-family: 'Karla';
    font-weight: 300;
    line-height: 150%;
  }
`;

export interface ToastMsgProps {
  closeToast?: () => void;
  toastType: 'success' | 'warning' | 'error';
  toastHeading: string | JSX.Element;
  toastParagraph?: string | JSX.Element;
}

const ToastMsg = ({ closeToast, toastType, toastHeading, toastParagraph }: ToastMsgProps) => (
  <ToastWrapper className={`toast-${toastType} ${!toastParagraph && 'single-line-message'}`}>
    {toastType === 'success' && <SuccessIcon />}
    {toastType === 'warning' && <WarningIcon />}
    {toastType === 'error' && <ErrorIcon />}
    <ToastMessage>
      <h4>{toastHeading}</h4>
      {toastParagraph && <p>{toastParagraph}</p>}
    </ToastMessage>
    <button type="button" onClick={closeToast}>
      <ProgressCircle />
    </button>
  </ToastWrapper>
);

export default ToastMsg;
