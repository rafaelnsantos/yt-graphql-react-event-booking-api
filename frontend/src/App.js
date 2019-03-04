import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { AuthProvider, GraphQLProvider } from './provider';
import { MainNavigation } from './components';
import './App.css';
const App = props => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GraphQLProvider url="http://localhost:8000/graphql">
          <MainNavigation />
          <main className="main-content">
            <Routes />
          </main>
        </GraphQLProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
