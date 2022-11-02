import styled from 'styled-components';

import { queries } from 'shared/layout';

import Layout from "components/Layout";
import HeroHeading from "components/HeroHeading";
import { ApiPromise } from "@polkadot/api";

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

interface PostPageProps {
    api: ApiPromise | null;
}

const PostPage = ({ api }: PostPageProps): JSX.Element => {
    return (
        <Layout>
            <Wrapper className="wrapper">
            <HeroHeading variant="post" />
            {/* {
                api?.at(latestBlockNumber)
                .then((api) => {
                    api.query
                })
            } */}

            </Wrapper>
        </Layout>
    )
}

export default PostPage;