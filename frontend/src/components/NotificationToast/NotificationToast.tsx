import React from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

import { queries } from 'shared/layout';

import ToastMessage from './ToastMessage';

const CustomToast = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress',
  autoClose: 5000,
  draggable: false,
  closeButton: false,
  closeOnClick: false,
  pauseOnHover: false,
})`
  &.toast-container {
    width: 100%;
    max-width: 950px;
    padding-top: 24px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toast {
    width: calc(100% - 48px);
    height: 100%;
    margin-bottom: 8px;
    border-radius: 4px;
    padding: 0;
    color: ${({ theme }) => theme.colors.background};
    cursor: default;
    display: grid;
    grid-template-columns: 1fr max-content;

    ${queries.tablet} {
      width: 100%;
    }
  }

  .body {
    padding: 0;
    height: 100%;

    & > div {
      height: 100%;
    }

    .message-link {
      color: ${({ theme }) => theme.colors.background};
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const NotificationToast = (): JSX.Element => <CustomToast position="top-center" hideProgressBar />;

export const displaySuccessToast = (): void => {
  const toastHeading = "I'm a success toast heading, find me in displaySuccessToast method";
  const toastParagraph = "I'm a success toastParagraph in displaySuccessToast";
  toast(
    <ToastMessage toastType="success" toastHeading={toastHeading} toastParagraph={toastParagraph} />
  );
};

export const displayWarningToast = (): void => {
  const toastHeading = "I'm a warning toastHeading, find me in displayWarningToast method";
  const toastParagraph = (
    <span>
      I&apos;m a warning toastParagraph, find me in displayWarningToast method&nbsp;
      <span className="message-link">Marketplace</span>.
    </span>
  );
  toast(
    <ToastMessage toastType="warning" toastHeading={toastHeading} toastParagraph={toastParagraph} />
  );
};

export const displayErrorToast = (errorMsg: string | JSX.Element): void => {
  toast(<ToastMessage toastType="error" toastHeading={errorMsg} />, { toastId: 'error-toast-id' });
};

export default NotificationToast;
