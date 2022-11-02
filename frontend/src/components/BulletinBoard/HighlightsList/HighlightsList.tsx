import HeroHeading from 'components/HeroHeading';
import Layout from 'components/Layout';
import SectionHeader from 'components/SectionHeader';
import { queries } from 'shared/layout';
import styled from 'styled-components';
import getWalletAddressShort from 'utils/getWalletAddressShort';
import HighlightsRow from './HighlightsRow';


const HighlightsListWrapper = styled.div`
  width: 100%;
  margin-top: 67px;
  display: flex;
  flex-direction: column;
  gap: 43px;

  &::before {
    content: '';
    width: calc(50% - 80px);
    position: absolute;
    left: 0;
    background: ${({ theme }) => theme.colors.background};
    height: 75px;
    z-index: 2;
  }

  &::after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    left: calc(50% - 80px);
    border-width: 75px 0 0 58px;
    border-style: solid;
    border-color: transparent transparent transparent ${({ theme }) => theme.colors.background};
    z-index: 2;
  }

  & .background-gradient {
    width: 100%;
    height: 275px;
    margin-top: -200px;
    position: absolute;
    left: 0;
    background: radial-gradient(
      50% 181.09% at 50% 181.09%,
      ${({ theme }) => theme.colors.night[150]} 55.39%,
      transparent 100%
    );
    z-index: 1;
  }

  ${queries.tiny} {
    &.no-space-right {
      margin-right: -24px;
    }

    &::before {
      width: calc(70% - 80px);
    }

    &::after {
      left: calc(70% - 80px);
    }
  }
`;


const HighlightsBoardContainer = styled.div`
  margin-bottom: 88px;
  display: grid;
  grid-auto-rows: 48px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 300;
  width: 100%;
  overflow-x: auto;

  & .board-row {
    min-width: 568px;

    & div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & p {
        width: 30%;

        &:nth-of-type(2) {
          text-align: center;
        }

        &:last-of-type {
          text-align: end;

          ${queries.tiny} {
            margin-right: 24px;
          }
        }
      }
    }
  }

  & .error-text {
    font-family: 'Gilroy';
    text-align: center;
  }
`;

const HighlightsPlaceholder = styled.div`
  width: 100%;
  height: 147px;
  margin-bottom: 46px;
  border: 1px dashed ${({ theme }) => theme.colors.night[300]};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  font-size: 16px;
  line-height: 125%;
`;


const HighlightsHeaderWrapper = styled.div`
  z-index: 5;
  margin-top: 58px;
`;

const HighlightsBoardHeading = styled.div`
  padding: 0 16px;

  text-transform: uppercase;
  font-size: 11px;
  line-height: 120%;
  letter-spacing: 3px;
  grid-row: 1 / 2;
  height: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: 48px 1fr;
`;

interface HighlightsListProps {
  walletAddress?: string;
}


interface Highlight {
  author: string,
  id: number,
  text: string,
}

const top_highlights: Highlight[] = [
  { author: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", id: 1, text: "Test text" },
  { author: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKut1Y", id: 2, text: "Test text" }
];


const HighlightsList = ({ walletAddress }: HighlightsListProps): JSX.Element => {
  return (
    <HighlightsListWrapper className={top_highlights?.length ? 'no-space-right' : ''}>
      <div className="background-gradient" />
      <HighlightsHeaderWrapper>
        <SectionHeader>
          Top 10 <span>highlights</span>
        </SectionHeader>
      </HighlightsHeaderWrapper>

      {!!top_highlights?.length && (
        <HighlightsBoardContainer>
          <HighlightsBoardHeading className="board-row">
            <p>#</p>
            <div>
              <p>Wallet address</p>
              <p>Text</p>
              <p>Bulletin ID</p>
            </div>
          </HighlightsBoardHeading>
          {top_highlights.map(({ author, id, text }, index) => (
            <HighlightsRow walletAddress={walletAddress} author={author} id={id} text={text} position={index + 1} />
          ))}
        </HighlightsBoardContainer>
      )}

      {!top_highlights?.length && (
        <HighlightsPlaceholder>
          {<p>No records yet</p>}
        </HighlightsPlaceholder>
      )}
    </HighlightsListWrapper>
  );
};

export default HighlightsList;