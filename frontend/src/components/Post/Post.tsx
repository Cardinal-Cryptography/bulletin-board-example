import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import getWalletAddressShort from 'utils/getWalletAddressShort';

const PostWrapper = styled.div`
  width: 75%;
  height: max-content;
  border: 2px solid ${({ theme }) => theme.colors.night[300]};
  border-radius: 2px;
  display: flex;
  flex-direction: column;

  &.own-post {
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  h3 {
    align-self: center;
    font-weight: 500;
    padding: 20px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .post-bottom {
    min-height: 60px;
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.night[300]};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  p {
    span {
      font-weight: 700;
    }
  }

  button {
    height: 36px;
    width: max-content;
    color: ${({ theme }) => theme.colors.primaryDarker};
    background: ${({ theme }) => theme.colors.button.secondary};
    border-radius: 18px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8.5px 16px;
    gap: 8px;
    justify-self: end;
    position: relative;
    transition: background-color 0.4s ease, opacity 0.4s ease;
    will-change: background-color, opacity;
    justify-self: center;

    &:hover {
      background: ${({ theme }) => theme.colors.button.secondaryHover};
    }
  }
`;

interface PostProps {
  author: string;
  text: string;
  onPostDelete: (authorId: string) => void;
  displayFullPost: (authorId: string) => void;
}

const Post = ({ author, text, onPostDelete, displayFullPost }: PostProps): JSX.Element => {
  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);
  const isAuthor = loggedAccount?.address === author;

  return (
    <PostWrapper className={`${isAuthor ? 'own-post' : ''}`}>
      <h3 role="presentation" onClick={() => displayFullPost(author)}>
        {text}
      </h3>
      <div className="post-bottom">
        <p>
          <span>author:</span> {getWalletAddressShort(author)}
        </p>
        {isAuthor && (
          <button type="button" onClick={() => onPostDelete(author)}>
            Delete
          </button>
        )}
      </div>
    </PostWrapper>
  );
};

const MemoizedPost = React.memo(Post);

export default MemoizedPost;
