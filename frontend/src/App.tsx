import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { IntercomProvider } from 'react-use-intercom';
import { Provider as ReduxProvider } from 'react-redux';

import './App.css';
import { displayErrorToast } from 'components/NotificationToast';
import PostPage from 'components/PostPage';
import BulletinBoard from 'components/BulletinBoard';
import AnotherNavBarPage from 'components/AnotherNavBarPage';

import formatChainStringToNumber from 'utils/formatChainStringToNumber';
import { ErrorToastMessages } from 'shared/constants/index';

import store from './redux/store';

const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID ?? '';

const App = (): JSX.Element => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [, setLastChainBlock] = useState<number | null>(null);
  const [, setLastlastBlockParent] = useState<string | null>(null);

  useEffect(() => {
    const setupProvider = async () => {
      const wsProvider = new WsProvider(process.env.REACT_APP_PROVIDER_URL);
      const wsApi = await ApiPromise.create({ provider: wsProvider, throwOnConnect: true });

      if (!wsApi) return;
      // eslint-disable-next-line no-console
      console.log(`Successfully connected to: ${process.env.REACT_APP_PROVIDER_URL}`);
      setApi(wsApi);

      await wsApi.rpc.chain.subscribeNewHeads((lastHeader) => {
        const lastBlock = formatChainStringToNumber(JSON.stringify(lastHeader.number.toHuman()));
        setLastChainBlock(lastBlock);
        setLastlastBlockParent(lastHeader.parentHash.toRawType);
      });
    };

    setupProvider().catch((error) => {
      displayErrorToast(ErrorToastMessages.ERROR_API_CONN);
      // eslint-disable-next-line no-console
      console.error(error);
    });
  }, []);

  return (
    <ReduxProvider store={store}>
      <IntercomProvider appId={INTERCOM_APP_ID} autoBoot>
        <Router>
          <Routes>
            {api && <Route path="/browse" element={<BulletinBoard api={api} />} />}
            {api && <Route path="/post" element={<PostPage api={api} />} />}
            <Route path="/another" element={<AnotherNavBarPage />} />
            <Route path="*" element={<Navigate to="/browse" replace />} />
          </Routes>
        </Router>
      </IntercomProvider>
    </ReduxProvider>
  );
};

export default App;
