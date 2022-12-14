import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { useSelector } from 'react-redux';

import Layout from 'components/Layout';
import HeroHeading from 'components/HeroHeading';

import { queries } from 'shared/layout';
import { getHighlightPricePerBlock } from 'utils/getHighlightPricePerBlock';
import { RootState } from 'redux/store';
import { sendPost } from 'utils/sendPost';

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

  .post-form {
    font-size: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 300px;

    label {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.input-row {
        flex-direction: row;
      }
    }

    input {
      font-size: 16px;

      &#post-is-highlight {
        accent-color: ${({ theme }) => theme.colors.primary};
        width: 20px;
      }
    }

    input[type='text'],
    input[type='number'] {
      padding: 10px;
      border-radius: 10px;
    }

    p {
      margin-top: 20px;
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
      align-self: center;

      &:hover {
        background: ${({ theme }) => theme.colors.button.secondaryHover};
      }
    }
  }
`;

interface PostPageProps {
  api: ApiPromise | null;
}

const PostPage = ({ api }: PostPageProps): JSX.Element => {
  const [postText, setPostText] = useState<string>('');
  const [isHighlight, setIsHighlight] = useState<boolean>(false);
  const [numOfBlocksHighlight, setNumOfBlocksHighlight] = useState<number>(0);
  const [highlightPricePerBlock, setHighlightPricePerBlock] = useState<number>(0);

  const loggedAccount = useSelector((state: RootState) => state.walletAccounts.account);

  useEffect(() => {
    const getHighlightBlockPrice = async () => {
      const fetchedPrice = await getHighlightPricePerBlock(api);
      setHighlightPricePerBlock(fetchedPrice ?? 0);
    };

    getHighlightBlockPrice();
  }, [api]);

  const getHighlightTotalPrice = (): number => highlightPricePerBlock * numOfBlocksHighlight;

  const isButtonDisabled = (): boolean => {
    if (isHighlight) {
      return !(loggedAccount && postText.length && numOfBlocksHighlight);
    }
    return !(loggedAccount && postText.length);
  };

  const handleSendPost = (): void => {
    if (!loggedAccount) return;
    const totalPrice = getHighlightTotalPrice();
    sendPost(numOfBlocksHighlight, postText, totalPrice, api, loggedAccount);
  };

  return (
    <Layout>
      <Wrapper className="wrapper">
        <HeroHeading variant="post" />
        <div className="post-form">
          <label htmlFor="post-input">
            Post text:
            <input
              type="text"
              id="post-input"
              value={postText}
              placeholder="Your post text..."
              onChange={({ target }) => setPostText(target.value)}
            />
          </label>
          <label htmlFor="post-is-highlight" className="input-row">
            Highlight post:
            <input
              type="checkbox"
              id="post-is-highlight"
              defaultChecked={isHighlight}
              onChange={() => setIsHighlight(!isHighlight)}
            />
          </label>
          {isHighlight && (
            <label htmlFor="post-input">
              Num. of blocks to be highlighted:
              <input
                type="number"
                id="post-num-highlight"
                value={numOfBlocksHighlight}
                placeholder="0"
                onChange={({ target }) => setNumOfBlocksHighlight(+target.value)}
              />
            </label>
          )}
          {isHighlight && !!numOfBlocksHighlight && (
            <p>Price for highlight: {getHighlightTotalPrice()} mAZERO.</p>
          )}
          <button type="button" disabled={isButtonDisabled()} onClick={handleSendPost}>
            Post
          </button>
        </div>
      </Wrapper>
    </Layout>
  );
};

export default PostPage;
