import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert, DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown  } from 'reactstrap';
import "./events.css"

//orderPage is for create order

export default function EventsPage({history}){

    const [departure, setDeparture] = useState("")
    const [destination, setDestination] = useState("")
    const [minDate, setMinDate] = useState("")
    const [maxDate, setMaxDate] = useState("")
    const [weight, setWeight] = useState("")
    const [size, setSize] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError]  = useState(false)
    const [success, setSuccess] = useState(false)
    const [dropdownOpen, setOpen] = useState(false); // check if neccesory
    const user = localStorage.getItem('user');

    useEffect(()=>{
        if(!user) history.push('./login')
    },[])

    const submitHandler = async (ord) =>{
        ord.preventDefault()
        const orderData = new FormData();

        orderData.append("departure", departure);
        orderData.append("destination", destination);
        orderData.append("minDate", minDate);
        orderData.append("maxDate", maxDate);
        orderData.append("weight", weight);
        orderData.append("size", size);
        orderData.append("description", description);
        
        console.log("test1")
        try {
            if(departure !== "" && destination !== "" && 
            minDate !== "" && maxDate !== "Sport" && weight !== "" 
                && size !== ""){
                    await api.post("/order", orderData, {headers: {user: user} })
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
            <h2>Order:</h2>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>   
                        <Input id="departure" type="text" value={departure} placeholder={'departure city'} 
                               onChange={(ord) => setDeparture(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="destination" type="text" value={destination} placeholder={'destination city'} 
                               onChange={(ord) => setDestination(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="minDate" type="text" value={minDate} placeholder={'minDate'} 
                               onChange={(ord) => setMinDate(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="maxDate" type="maxDate" value={maxDate} placeholder={'maxDate'} 
                               onChange={(ord) => setMaxDate(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="weight" type="weight" value={weight} placeholder={'weight'} 
                               onChange={(ord) => setWeight(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="size" type="size" value={size} placeholder={'size'} 
                               onChange={(ord) => setSize(ord.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Input id="description" type="text" value={description} placeholder={'Event description'} 
                               onChange={(ord) => setDescription(ord.target.value)} />
                    </FormGroup>
                    
                </div>
                <FormGroup>
                    <Button className="submit-btn"  type="submit">
                        ثبت سفارش
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
