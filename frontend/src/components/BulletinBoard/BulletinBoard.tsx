import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
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
import PostDetailsPopup from './PostDetailsPopup';
import { ApiPromiseType } from '../../App';

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
  api: ApiPromiseType;
}

const BulletinBoard = ({ api }: BulletinBoardProps): JSX.Element => {
  const [posts, setPosts] = useState<PostByAccount[]>([]);
  const dispatch = useDispatch();
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);
  const testPosts = useSelector((state: RootState) => state.posts.posts);
  const [postDetailsDisplay, setPostDetailsDisplay] = useState<PostByAccount | null>(null);

  const getAllPostsAuthors = useCallback(async () => {
    const postsAuthors = api && (await getPostsAuthors(api));
    return postsAuthors;
  }, [api]);

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
            if (post) {
              allPosts.push(post);
              if (i === authors.length - 1) {
                setPosts(allPosts);
              }
            }
          });
        });
      }
    });
  }, [getAllPostsAuthors, getPostByAuthor, dispatch]);

  useEffect(() => {
    dispatch(setAllPosts(posts));
  }, [posts, posts.length, dispatch]);

  const handlePostDelete = () => {
    if (!loggedAccount) return;
    if (api) {
      deletePost(api, loggedAccount, () => dispatch(removePost(loggedAccount.address)));
    }
  };

  const displayFullPost = (id: string) => {
    const postToBeDisplayed = posts.find((post) => post.author === id);
    if (!postToBeDisplayed) return;
    setPostDetailsDisplay(postToBeDisplayed);
  };

  return (
    <>
      {postDetailsDisplay && (
        <PostDetailsPopup
          post={postDetailsDisplay}
          onPopupClose={() => setPostDetailsDisplay(null)}
        />
      )}
      <Layout>
        <Wrapper className="wrapper">
          <HeroHeading variant="browse" />
          <BulletinBoardContainer>
            {testPosts.map(({ author, text }) => (
              <Post
                key={author}
                author={author}
                text={text}
                onPostDelete={handlePostDelete}
                displayFullPost={displayFullPost}
              />
            ))}
          </BulletinBoardContainer>
          <HighlightsList api={api} />
        </Wrapper>
      </Layout>
    </>
  );
};

export default BulletinBoard;
