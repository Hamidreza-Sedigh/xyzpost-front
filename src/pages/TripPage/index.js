import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert, DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown  } from 'reactstrap';
import "./index.css"

//TripPage is for create order

export default function EventsPage({history}){

    const [departure, setDeparture] = useState("")
    const [destination, setDestination] = useState("")
    const [tripDate, setTripDate] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError]  = useState(false)
    const [success, setSuccess] = useState(false)
    const user = localStorage.getItem('user');

    useEffect(()=>{
        if(!user) history.push('./login')
    },[])

    const submitHandler = async (tr) =>{
        tr.preventDefault()
        const tripData = new FormData();

        tripData.append("departure", departure);
        tripData.append("destination", destination);
        tripData.append("tripDate", tripDate);
        tripData.append("description", description);
        
        console.log("test1")
        try {
            if(departure !== "" && destination !== "" && tripDate !== "" ){
                    await api.post("/trip", tripData, {headers: {user: user} })
                    setSuccess(true)
                    setTimeout(()=>{
                        setSuccess(false)
                        history.push("/")
                    }, 2000)
            } else {
                console.log("test else");
                setError(true)
                setTimeout(()=>{
                    setError(false)
                }, 2000)
            }
        } catch (error) {
            console.log("the Error:", error.message);
        }
        return "";
    }

    return(
        <Container>
            <h2>ثبت سفر:</h2>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>   
                        <Input id="departure" type="text" value={departure} placeholder={'departure city'} 
                               onChange={(tr) => setDeparture(tr.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="destination" type="text" value={destination} placeholder={'destination city'} 
                               onChange={(tr) => setDestination(tr.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="tripDate" type="text" value={tripDate} placeholder={'tripDate'} 
                               onChange={(tr) => setTripDate(tr.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="description" type="text" value={description} placeholder={'description'} 
                               onChange={(tr) => setDescription(tr.target.value)} />
                    </FormGroup>
                    
                </div>
                <FormGroup>
                    <Button className="submit-btn"  type="submit">
                        create trip
                    </Button>
                </FormGroup>
                <FormGroup>
                <Button className="secondary-btn" onClick={()=>history.push("/")}>
                        Dashboard
                    </Button>
                </FormGroup>
            </Form>
        </Container>
    );
}
