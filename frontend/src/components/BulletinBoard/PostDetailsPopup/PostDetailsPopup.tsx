import React from 'react';
import styled from 'styled-components';

import { PostByAccount } from 'utils/getPostByAccount';
import getWalletAddressShort from 'utils/getWalletAddressShort';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.backgroundDimmed};
  z-index: 3000;

  display: flex;
  justify-content: center;
  align-items: center;

  .post-details {
    background-color: ${({ theme }) => theme.colors.background};
    min-width: 400px;
    max-width: 700px;
    max-height: 400px;
    overflow-wrap: break-word;
    box-shadow: ${({ theme }) => theme.colors.nightShadow};

    h3 {
      align-self: center;
      font-weight: 500;
      padding: 20px;
      width: 100%;
    }
  }

  .post-bottom {
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.night[300]};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const PostDetailsPopup = ({
  post,
  onPopupClose,
}: {
  post: PostByAccount;
  onPopupClose: () => void;
}): JSX.Element => (
  <Wrapper id="post-details-popup-bg" role="presentation" onClick={onPopupClose}>
    <div className="post-details" role="presentation">
      <h3>{post.text}</h3>
      <div className="post-bottom">
        <p>
          <span>author:</span> {getWalletAddressShort(post.author)}
        </p>
      </div>
    </div>
  </Wrapper>
);

export default PostDetailsPopup;
