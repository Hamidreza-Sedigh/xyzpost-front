import React from 'react';
//import logo from './logo.svg';  // remove by jean
import {Container} from 'reactstrap';
import Routes from './routes';
import {ContextWrapper} from './user-context'
import './App.css';
//import { Route } from 'react-router-dom';

function App() {
  return (
    <ContextWrapper>
      <Container>
        <h1>post from anywhere to anywhere</h1>
        <div className="content" > 
          <Routes/>
        </div>
      </Container>
    </ContextWrapper>
  );
}

export default App;
