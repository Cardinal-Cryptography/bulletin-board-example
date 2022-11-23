import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { useDispatch, useSelector } from 'react-redux';

import HeroHeading from 'components/HeroHeading';
import Layout from 'components/Layout';
import Post from 'components/Post';

import { RootState } from 'redux/store';
import { removePost, setAllPosts } from 'redux/slices/postsSlice';
import { queries } from 'shared/layout';
import { deletePost } from 'utils/deletePost';
import { getPostsAuthors } from 'utils/getPostsAuthors';
import { getPostByAccount, PostByAccount } from 'utils/getPostByAccount';

import HighlightsList from './HighlightsList';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.white};
`;

const BulletinBoardContainer = styled.div`
  width: 100%;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  z-index: 10;

  ${queries.tablet} {
  }
`;

interface BulletinBoardProps {
  api: ApiPromise;
}

const BulletinBoard = ({ api }: BulletinBoardProps): JSX.Element => {
  const [posts, setPosts] = useState<PostByAccount[]>([]);
  const dispatch = useDispatch();
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);
  const testPosts = useSelector((state: RootState) => state.posts.posts);

  useEffect(() => {
    const allPosts: PostByAccount[] = [];
    const getAllPostsAuthors = async () => {
      const postsAuthors = await getPostsAuthors(api);
      return postsAuthors;
    };

    const getPostByAuthor = async (accountId: string) => {
      const post = await getPostByAccount(accountId, api);
      return post;
    };

    getAllPostsAuthors().then((authors) => {
      authors?.forEach((author) => {
        getPostByAuthor(author).then((post) => {
          if (post) {
            allPosts.push(post);
          }
        });
      });
    });
    setPosts(allPosts);
  }, [api, dispatch]);

  useEffect(() => {
    dispatch(setAllPosts(posts));
  }, [posts, posts.length, dispatch]);

  const handlePostDelete = (): void => {
    if (!loggedAccount) return;
    deletePost(api, loggedAccount).then(() => dispatch(removePost(loggedAccount.address)));
  };

  return (
    <Layout>
      <Wrapper className="wrapper">
        <HeroHeading variant="browse" />
        <BulletinBoardContainer>
          {testPosts.map(({ author, text }) => (
            <Post key={author} author={author} text={text} onPostDelete={handlePostDelete} />
          ))}
        </BulletinBoardContainer>
        <HighlightsList api={api} />
      </Wrapper>
    </Layout>
  );
};

export default BulletinBoard;
