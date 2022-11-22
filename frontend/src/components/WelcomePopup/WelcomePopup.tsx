import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import SectionHeader from 'components/SectionHeader';

import { ReactComponent as TabStripeFullWidth } from 'assets/TabStripeFullWidth.svg';
import { ReactComponent as CloseIcon } from 'assets/CloseModal.svg';
import { queries } from 'shared/layout';
import { ReactComponent as Icon } from 'assets/Launch.svg';
import { hidePopup } from 'redux/slices/welcomePopupSlice';

const Popup = styled.div`
  width: 90%;
  max-width: 1176px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.night[150]};
  box-shadow: ${({ theme }) => theme.colors.nightShadow};
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 12;

  ${queries.tiny} {
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
  }

  ${queries.tablet} {
    grid-template-columns: 250px 1fr;
    grid-template-rows: max-content min-content;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .close-button {
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    margin: 15px 24px 0 0;
  }

  & svg {
    width: 100%;
    height: auto;
  }
`;

const Content = styled.div`
  height: 100%;
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(max-content, 20%) 1fr;
  gap: 24px;

  & > .content-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }

  ${queries.tiny} {
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1fr;

    & > .content-right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
`;

const CopyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  line-height: 24px;
  font-family: 'Karla';
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.04em;

  p {
    margin: 0;
  }
`;

const Button = styled.button`
  height: 36px;
  width: 215px;
  color: ${({ theme }) => theme.colors.primaryDarker};
  background: linear-gradient(
      0deg,
      ${({ theme }) => theme.colors.button.shadowDark},
      ${({ theme }) => theme.colors.button.shadowDark}
    ),
    ${({ theme }) => theme.colors.night[100]};
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 135%;
  letter-spacing: 0.06em;
  display: flex;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryLighter};
  }

  &:disabled {
    opacity: 0.3;
  }

  ${queries.tiny} {
    position: unset;
    justify-self: end;
  }
`;

const WelcomePopup = (): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <Popup>
      <Header>
        <button type="button" className="close-button" onClick={() => dispatch(hidePopup())}>
          <CloseIcon />
        </button>
        <TabStripeFullWidth />
      </Header>
      <Content>
        <SectionHeader>
          Example <span>frontend</span>
        </SectionHeader>
        <div className="content-right">
          <CopyContainer>
            <p>
              This is a WelcomePopup in the example frontend for dApps created on Aleph Zero
              network.
            </p>
            <p>This is another paragraph in the popup.</p>
          </CopyContainer>
          <Button>
            <span>Put your link here. If you want :) </span>
            <Icon />
          </Button>
        </div>
      </Content>
    </Popup>
  );
};

const MemoizedWelcomePopup = React.memo(WelcomePopup);

export default MemoizedWelcomePopup;
