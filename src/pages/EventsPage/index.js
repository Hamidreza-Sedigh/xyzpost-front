import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert, DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown  } from 'reactstrap';
import CameraIcon from '../../assets/camera.png'
import "./events.css"

//eventsPage will show all the events       

export default function EventsPage({history}){

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [sport, setSport] = useState("Sport")
    const [date, setDate] = useState("")
    const [error, setError]  = useState(false)
    const [success, setSuccess] = useState(false)
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    useEffect(()=>{
        if(!user) history.push('./login')
    },[])

    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(()=>{
        return thumbnail ? URL.createObjectURL(thumbnail):null; 
    }, [thumbnail])

    //console.log(title, description, price, sport, );

    const submitHandler = async (evt) =>{
        evt.preventDefault()
        const eventData = new FormData();

        eventData.append("thumbnail", thumbnail);
        eventData.append("sport", sport);
        eventData.append("title", title);
        eventData.append("price", price);
        eventData.append("description", description);
        eventData.append("date", date);
        
        console.log("test1")
        try {
            if(title !== "" && description !== "" && 
                price !== "" && sport !== "Sport" && date !== "" 
                && thumbnail !== null){
                    await api.post("/event", eventData, {headers: {user: user} })
                    setSuccess(true)
                    setTimeout(()=>{
                        setSuccess(false)
                        history.push("/")
                    }, 2000)
            } else {
                console.log("test number 5");
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

    const sportEventHandler = (sport) => setSport(sport);

    console.log(sport)
    return(
        <Container>
            <h2>Create your Event:</h2>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>
                        
                        <Label id="thumbnail" style={{backgroundImage : `url(${preview})`}} className={thumbnail ? 'has-thumbnail' : ''} >
                            <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
                            <img src={CameraIcon} style={{ maxWidth: "50px"  }} alt="upload icon " />
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        
                        <Input id="title" type="text" value={title} placeholder={'Event title'} onChange={(evt) => setTitle(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        
                        <Input id="description" type="text" value={description} placeholder={'Event description'} onChange={(evt) => setDescription(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        
                        <Input id="price" type="text" value={price} placeholder={'Event price $0.00'} onChange={(evt) => setPrice(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        
                        <Input id="date" type="date" value={date} placeholder={'Event price $0.00'} onChange={(evt) => setDate(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                        <Button id="caret" color="info" value={sport} disabled>{sport}</Button>
                        <DropdownToggle caret color="info" />
                        <DropdownMenu>
                            <DropdownItem onClick={() => sportEventHandler('running')}>running</DropdownItem>
                            <DropdownItem onClick={() => sportEventHandler('cycling')}>cycling</DropdownItem>
                            <DropdownItem onClick={() => sportEventHandler('swimming')}>swimming</DropdownItem>
                        </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn"  type="submit">
                        create event
                    </Button>
                </FormGroup>
                <FormGroup>
                <Button className="secondary-btn" onClick={()=>history.push("/")}>
                        Dashboard
                    </Button>
                </FormGroup>
            </Form>
            { error ? (
                <Alert className="event-validation" color="danger">missing required information</Alert>
            ): "" }
            { success ? (
                <Alert className="event-validation" color="success">suuccess!!</Alert>
            ): "" }
        </Container>
    );
}