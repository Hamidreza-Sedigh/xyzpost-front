import React, {useEffect, useState, useMemo} from 'react';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import socketio from 'socket.io-client';
//import Registration from '../../../../backend/src/models/Registration';


//dashboard will show all the events       
export default function Dashboard({history}){
    const [events, setEvents] = useState([]);
    const [orders, setOrders] = useState([]); // I added
    const [trips, setTrips] = useState([]); // I added
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    //const [cSelected, setCSelected] = useState([]); // jean deleted

    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageHandler, setMessageHandler] = useState('');
    const [eventsRequest, setEventsRequest] = useState([]);
    const [dropdownOpen, setDropdownOpen ] = useState(false);
    const [eventRequestMessage, setEventRequestMessage ] = useState('');
    const [eventRequestSuccess, setEventRequestSuccess] =  useState(false);

    var view = 'orders'

    const toggle = () => setDropdownOpen(!dropdownOpen)

    useEffect(()=>{
        getOrders()
    },[]);

    const socket = useMemo(
        () => 
        socketio('http://localhost:8000/', { query: { user: user_id } }),
        [user_id]
        );

    useEffect(()=>{
        console.log("use effect test socket");
        //socket.on('hamid', response => console.log(response) )
        socket.on('registration_request', data => ( setEventsRequest([ ...eventsRequest, data]) ) )
    },[eventsRequest, socket]);

    const filterHandler = (query) =>{
        //setRSelected(query)
        //getEvents(query)
        getOrders()
    }

    const myEventHandler = async () => {
        try {
            //setRSelected('myevents')
            const response = await api.get('/user/events', { headers: { user: user }})
            setEvents(response.data.events);
        } catch (error) {
            history.push('/login');
        }
    }
    const getEvents = async(filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : `/dashboard`
            const response = await api.get(url, { headers: { user: user }})

            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }
    };
    const getOrders = async() => {
        try {
            //const url = filter ? `/dashboard/${filter}` : `/dashboard`
            setRSelected('orders')
            const url =  `/dashboard-orders`;
            console.log("URL:", url, 'rSelected:', rSelected);
            const response = await api.get(url, { headers: { user: user }})
            console.log("response:",response);
            setOrders(response.data.orders)    // error is here
        } catch (error) {
            history.push('/login');
        }
    };

    const getTrips = async() => {
        try {
            //const url = filter ? `/dashboard/${filter}` : `/dashboard`
            setRSelected('trips')
            const url =  `/dashboard-trips`;
            console.log("URL:", url, 'rSelected:', rSelected);
            const response = await api.get(url, { headers: { user: user }})
            console.log("response:",response);
            setTrips(response.data.trips)    // error is here
        } catch (error) {
            history.push('/login');
        }
    };


    const deleteEventHandler = async(eventId) =>{
        try {
            const deleteEvent = await api.delete(`/event/${eventId}`, { headers: { user: user }} )
            setSuccess(true)
            setMessageHandler("delete suuccess!!");
            setTimeout(()=>{
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('');
            }, 2000)
        } catch (error) {
            setError(true)
            setMessageHandler('Error when deleting')
            setTimeout(()=>{
                setError(false)
                setMessageHandler('');
            }, 2000)
        }
    }

    const registrationRequsetHandler = async (event) =>{
        try {
            console.log("function works");
            await api.post(`/registration/${event.id}`, {}, {headers: { user }})

            setSuccess(true)
            setMessageHandler(`The requst for the event ${event.title} was successfully`);
            setTimeout(()=>{
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('');
            }, 2000)
        } catch (error) {
            setError(true)
            setMessageHandler(`The requst for the event ${event.title} was NOT successfully`)
            setTimeout(()=>{
                setError(false)
                setMessageHandler('');
            }, 2000)
        }
    }

    const acceptEventHandler = async (eventId) =>{
        try {
            console.log("accept hit");
            //const response = await api.post(`/registration/${eventId}/approvals`, {}, {headers: { user }}) //console.log("response:", response)
            await api.post(`/registration/${eventId}/approvals`, {}, {headers: { user }})    
            setEventRequestSuccess(true);
            setEventRequestMessage('Event approved succesfully');
            removeNotification(eventId);
            setTimeout(()=>{
                setEventRequestSuccess(false)
                setEventRequestMessage('');
            }, 2500)
        } catch(error) {
            console.log(error)
        }        
    }

    const rejectEventHandler = async (eventId) =>{
        try {
            console.log("accept hit");
            //const response = await api.post(`/registration/${eventId}/approvals`, {}, {headers: { user }}) //console.log("response:", response)
            await api.post(`/registration/${eventId}/rejections`, {}, {headers: { user }})    
            setEventRequestSuccess(true);
            setEventRequestMessage('Event rejected succesfully');
            removeNotification(eventId);
            setTimeout(()=>{
                setEventRequestSuccess(false)
                setEventRequestMessage('');
            }, 2500)
        } catch(error) {
            console.log(error)
        }
    }

    const removeNotification = (eventId) => {
        const newEvents = eventsRequest.filter((event) => event._id !== eventId )
        setEventsRequest(newEvents);
    }

    return(
        <>
            <ul className="notifications">
                { eventsRequest.map(request =>{
                    return(
                            <li key={request._id}>
                                <div>
                                    <strong>{request.user.email}</strong> Is requesing to register to your event
                                    <strong>{request.event.title}</strong>
                                </div>
                                <ButtonGroup>
                                    <Button color="secondary" onClick={ () => {acceptEventHandler(request._id) } } >Accept</Button>
                                    <Button color="danger"    onClick={ () => {rejectEventHandler(request._id) } } >Reject</Button>
                                </ButtonGroup>
                            </li>
                        )
                    }) }
            </ul>
            {eventRequestSuccess ? <Alert color="success"> {eventRequestMessage} </Alert> : ""}
            
            <div className="order-type">
                <ButtonGroup>
                    <Button color="primary" onClick={() => { getOrders() }}>  I'm  passenger   </Button>
                    <Button color="info"    onClick={() => { getTrips()  }}>I want to send pack</Button>
                </ButtonGroup>
            </div>
            
            <div className="filter-panel">  
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        Filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => getOrders()} active={rSelected === null}>All Sports</DropdownItem>
                        <DropdownItem onClick={getOrders} active={rSelected === 'myevents'}>My Events</DropdownItem>
                        <DropdownItem onClick={() => getOrders()} active={rSelected === 'running'}>Running</DropdownItem>
                        <DropdownItem onClick={() => getOrders()} active={rSelected === 'cycling'}>Cycling</DropdownItem>
                        <DropdownItem onClick={() => getOrders()} active={rSelected === 'swimming'}>Swimming</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            
            <ul className="events-list">
                {
                (rSelected == 'orders') ?  
                orders.map(order => (
                    <li key={order._id}>
                        { order.user === user_id ? <Button color="danger" size="sm" onClick={() => deleteEventHandler(order._id)} >delete</Button> : ""}
                        {console.log("oooooooooooooooooooooooooo", view)}
                        <span> departure:  { order.departure } </span>
                        <span> destination:  { order.destination } </span>
                        <span> Date:  { moment(order.minDate).format('l') } </span>
                        <span> Date:  { moment(order.maxDate).format('l') } </span>
                        <span> weight: {parseFloat(order.weight).toFixed(2)} </span>
                        <span> size:  {parseFloat(order.size).toFixed(2)} </span>
                        <span> Description: {order.description} </span>
                        <Button color="primary" onClick={() => registrationRequsetHandler(order)}>Registration Request</Button>
                    </li>
                )):
                trips.map(trip => (
                    <li key={trip._id}>
                        { trip.user === user_id ? <Button color="danger" size="sm" onClick={() => deleteEventHandler(trip._id)} >delete</Button> : ""}
                        {console.log("tttttttttttttttttttttttttt", view)}
                        <span> departure:  { trip.departure } </span>
                        <span> destination:  { trip.destination } </span>
                        <span> Date:  { moment(trip.tripDate).format('l') } </span>
                        <span> Description: {trip.description} </span>
                        <Button color="primary" onClick={() => registrationRequsetHandler(trip)}>Registration Request</Button>
                    </li>
                ))
            }
            </ul>
            { error ? (
                <Alert className="event-validation" color="danger"> {messageHandler} </Alert>
            ): "" }
            { success ? (
                <Alert className="event-validation" color="success"> {messageHandler} </Alert>
            ): "" }
        </>
    );
}