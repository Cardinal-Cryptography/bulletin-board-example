import { ApiPromise } from "@polkadot/api";
import HeroHeading from "components/HeroHeading";
import Layout from "components/Layout";
import { queries } from 'shared/layout';
import styled from 'styled-components';

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


interface AnotherNavBarPageProps {
    api: ApiPromise | null
}

const AnotherNavBarPage = ({ api } : AnotherNavBarPageProps): JSX.Element => {
    return (
        <Layout>
            <Wrapper className="wrapper">
            <HeroHeading variant="another" />

            </Wrapper>
        </Layout>
    )
}
export default AnotherNavBarPage;