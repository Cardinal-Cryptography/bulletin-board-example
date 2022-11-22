import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import HeroHeading from 'components/HeroHeading';
import Layout from 'components/Layout';

import { RootState } from 'redux/store';
import { queries } from 'shared/layout';

import HighlightsList from './HighlightsList';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.white};
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

const BulletinBoard = (): JSX.Element => {
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);

  const [contractInfoOf] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const contractInfo = await api?.query.contracts.contractInfoOf(
  //       '5FbQfcbmD6XfypXcf7SgTu4uo9oqANaUui8LqaZgkyiWZLkJ'
  //     );
  //     const info = await api?.query.console // .contractApi.call query.contracts.contractInfoOf("5FbQfcbmD6XfypXcf7SgTu4uo9oqANaUui8LqaZgkyiWZLkJ");
  //       .log(info);
  //     setContractInfoOf(info?.toString() || 'f');
  //   };
  //   fetchData();
  // }, []);

  return (
    <Layout>
      <Wrapper className="wrapper">
        <HeroHeading variant="browse" />
        <BulletinBoardContainer>{contractInfoOf}</BulletinBoardContainer>
        <HighlightsList walletAddress={loggedAccount?.address} />
      </Wrapper>
    </Layout>
  );
};

export default BulletinBoard;
