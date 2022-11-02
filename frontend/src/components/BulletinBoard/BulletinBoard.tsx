import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ApiPromise } from '@polkadot/api';

import { queries } from 'shared/layout';
import HeroHeading from 'components/HeroHeading';
import Layout from 'components/Layout';
import HighlightsList from './HighlightsList';
import { RootState } from 'redux/store';

const Wrapper = styled.div`
    color: ${({ theme }) => theme.colors.white};

    .cards {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    justify-content: center;
    gap: 24px;

    ${queries.phone} {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr;
        gap: 12px;
    }
    }
`;


const BulletinBoardContainer = styled.div`
  min-height: 520px;
  margin-top: 52px;
  display: grid;
  gap: 0;
  grid-template-rows: 100%;
  grid-template-rows: max-content 493px;
  border: 1px solid ${({ theme }) => theme.colors.night[300]};
  z-index: 10;

  ${queries.tablet} {
    gap: 30px;
    grid-template-columns: repeat(2, calc(50% - 15px));
    grid-template-rows: 1fr;
  }

  ${queries.tiny} {
    width: 100%;
  }
`;


interface BulletinBoardProps {
  api: ApiPromise | null;
  lastChainBlock: string | null;
}

const BulletinBoard = ({ api, lastChainBlock }: BulletinBoardProps): JSX.Element => {
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);

  const [contractInfoOf, setContractInfoOf] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const contract_info = await api?.query.contracts.contractInfoOf("5FbQfcbmD6XfypXcf7SgTu4uo9oqANaUui8LqaZgkyiWZLkJ");
      const info = await api?.query. // .contractApi.call query.contracts.contractInfoOf("5FbQfcbmD6XfypXcf7SgTu4uo9oqANaUui8LqaZgkyiWZLkJ");
      console.log(info);
      setContractInfoOf(info?.toString() || "f");
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="wrapper">
        <HeroHeading variant="browse" />
        <BulletinBoardContainer>
          {contractInfoOf}
        </BulletinBoardContainer>
        <HighlightsList walletAddress={loggedAccount?.address} />
      </div>
    </Layout>
  )
}

export default BulletinBoard;