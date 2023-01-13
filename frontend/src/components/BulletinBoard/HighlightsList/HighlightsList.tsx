import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import SectionHeader from 'components/SectionHeader';

import { queries } from 'shared/layout';
import { getPostByAccount, PostByAccount } from 'utils/getPostByAccount';
import { getHighlightedPostsAuthors } from 'utils/getHighlightedPostsAuthors';

import HighlightsRow from './HighlightsRow';
import { ApiPromiseType } from '../../../App';

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
  api: ApiPromiseType;
}

const HighlightsList = ({ api }: HighlightsListProps): JSX.Element => {
  const [highlightedPosts, setHighlightedPosts] = useState<PostByAccount[]>([]);

  const getAllPostsAuthors = useCallback(async () => api && getHighlightedPostsAuthors(api), [api]);

  const getPostByAuthor = useCallback(
    async (accountId: string) => api && getPostByAccount(accountId, api),
    [api]
  );

  useEffect(() => {
    const allPosts: PostByAccount[] = [];

    getAllPostsAuthors().then((authors) => {
      if (authors && authors?.length) {
        authors.forEach((author, i) => {
          getPostByAuthor(author).then((post) => {
            if (post?.author) {
              allPosts.push(post);
              if (i === authors.length - 1) {
                setHighlightedPosts(allPosts);
              }
            }
          });
        });
      }
    });
  }, [getAllPostsAuthors, getPostByAuthor]);

  return (
    <HighlightsListWrapper className={highlightedPosts?.length ? 'no-space-right' : ''}>
      <div className="background-gradient" />
      <HighlightsHeaderWrapper>
        <SectionHeader>
          All <span>highlights</span>
        </SectionHeader>
      </HighlightsHeaderWrapper>

      {!!highlightedPosts?.length && (
        <HighlightsBoardContainer>
          <HighlightsBoardHeading className="board-row">
            <p>#</p>
            <div>
              <p>Author</p>
              <p>Text</p>
            </div>
          </HighlightsBoardHeading>
          {highlightedPosts.map(({ author, text }, index) => (
            <HighlightsRow author={author} text={text} position={index + 1} key={author} />
          ))}
        </HighlightsBoardContainer>
      )}

      {!highlightedPosts?.length && (
        <HighlightsPlaceholder>
          <p>No records yet</p>
        </HighlightsPlaceholder>
      )}
    </HighlightsListWrapper>
  );
};

export default HighlightsList;
