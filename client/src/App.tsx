import React from 'react';

import './App.css';
import { RootStoreContext } from './contexts/RootStoreContext';
import { PageRoots } from './Routes';

function App() {
  const rootStore = React.useContext(RootStoreContext);
  return (
    <div className='app'>
        <PageRoots rootStore={rootStore} />
    </div>
  );
}

export default App;
