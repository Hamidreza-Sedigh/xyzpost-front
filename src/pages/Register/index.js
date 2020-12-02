import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Input, Alert } from 'reactstrap';
import {UserContext} from '../../user-context';

export default function Register({history}){
    const { setIsLoggedIn} = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] =  useState("");
    const [lastName, setLastName] =  useState("");

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async evt =>{
        evt.preventDefault()

        if(email !== "" && password !== "" && firstName !== "" && lastName !== ""){
            const response = await api.post('/user/register', {email, password, firstName, lastName});
            const user = response.data.user || false;
            const user_id = response.data.user_id || false;

            if(user && user_id){
                console.log("in if");
                localStorage.setItem('user', user);
                localStorage.setItem('user_id', user_id);
                setIsLoggedIn(true);
                history.push('/');
            } else {
                console.log("in else");
                const {message} = response.data;
                setError(true);
                setErrorMessage(message)
                setTimeout(()=>{
                    setError(false)
                    setErrorMessage("")
                }, 2000)
            }
        } else {
            setError(true);
            setErrorMessage("fill allllll inputs! they are required")
            setTimeout(()=>{
                setError(false)
                setErrorMessage("")
            }, 2000)
        }
        

    }

    return(
        <Container>
            <h2>Register</h2>
            <p>pleae <strong>Register </strong>in to yoyr account</p>
            <Form onSubmit={handleSubmit} >
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="text" name="firstName" id="firstName" placeholder="your firstname" onChange={ evt => setFirstName(evt.target.value)}/>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="text" name="lastName" id="lastName" placeholder="your lastname" onChange={ evt => setLastName(evt.target.value)}/>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="email" name="email" id="exampleEmail" placeholder="your email" onChange={ evt => setEmail(evt.target.value)}/>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="password" name="password" id="examplePassword" placeholder="your password" onChange={ evt => setPassword(evt.target.value)} />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={()=>history.push("/login")}>login instead</Button>
                </FormGroup>
            </Form>
            { error ? (
                <Alert className="event-validation" color="danger"> {errorMessage} </Alert>
            ): "" }
        </Container>
    );
}