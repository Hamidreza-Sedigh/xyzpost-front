import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './pages/Login/index';  // or  './pages/Login/index'
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/index';
import EventsPage from './pages/EventsPage';
import MyRegistrations from './pages/MyRegistrations';
import OrderPage from './pages/OrderPage';
import TripPage from './pages/TripPage';
import TopNav from './components/TopNav';

export default function Routes(){
    return(
        <BrowserRouter>
            <TopNav/>
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/myregistrations' exact component={MyRegistrations} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/events' component={EventsPage} />
                <Route path='/order' component={OrderPage} />
                <Route path='/trip' component={TripPage} />
            </Switch>
        </BrowserRouter>
    );
}