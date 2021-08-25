import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import { RootStoreContext } from './contexts/RootStoreContext';
import { DownloadPage } from './pages/DownloadPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServerInfoPage } from './pages/ServerInfoPage';
import { StoryPage } from './pages/StoryPage';

function App() {
  const { authStore } = React.useContext(RootStoreContext);
  return (
    <div className='app'>
        <Switch>
          <Route path='/' component={HomePage} exact />
          <Route path='/home' component={HomePage} exact />
          <Route path='/login' component={LoginPage} exact />
          <Route path='/register' component={RegisterPage} exact />
          <Route path='/info' component={ServerInfoPage} exact />
          <Route path='/story' component={StoryPage} exact />
          <Route path='/guide' component={GuidePage} exact />
          <Route path='/downloads' component={DownloadPage} exact />
          <Route path='/logout' render={() => {
            authStore.logout();
            return <Redirect to='/' /> 
          }} />
        </Switch>
    </div>
  );
}

export default App;
