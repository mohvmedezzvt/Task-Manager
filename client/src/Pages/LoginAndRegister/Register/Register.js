import React from "react";
import logo from '../assets/TuskyPulseLogo.webp';
import FormInput from "../mainComponents/FormInput";
import RegisterBtn from "../mainComponents/RegisterBtn";
import LoginRegisterRef from "../mainComponents/LoginRegisterRef";
import IllustrationsLoginRegister from "../mainComponents/IllustrationsLoginRegister";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleAuth from "../mainComponents/googleAuth";
import { useState } from "react";
import './Register.scss';
import '../mainLoginRegStyling.scss'


export default function Register() {
    let [userInformation, setUserInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    function handleEmailInput(e) {
        setUserInfo({...userInformation, email:e.target.value})
    }
    function handleNameInput(e) {
        setUserInfo({...userInformation, name:e.target.value})
    }
    function handlePasswordInput(e) {
        setUserInfo({...userInformation, password:e.target.value})
    }
    return(
        <div className="main-page flex-center">
            <div className="form-background backgroundProps flex-center">
                <div className="auth-form">
                    <img src={logo} alt="logo"></img>
                    <h2>Register your account</h2>
                    <span>Welcome back! Register your new account</span>
                    <GoogleAuth />
                    <span className="separator">-----------------  or continue with email  -----------------</span>
                    <form>
                        <FormInput
                            className="user-info"
                            icon={faUser} handler={handleNameInput}
                            id="name"
                            type="name"
                            placeholder="Enter your name"
                        />
                        <FormInput
                            className="user-info"
                            icon={faEnvelope} handler={handleEmailInput}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                        <FormInput
                            className="user-info"
                            icon={faLock} handler={handlePasswordInput}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                        <RegisterBtn className="register-btn" type="submit" content="Register account"/>
                        <LoginRegisterRef
                            className="signUp-ref"
                            content="Have an account? "
                            link='/login'
                            linkContent="Log in !"
                        />
                    </form>
                </div>
                <IllustrationsLoginRegister 
                    className="form-illustration flex-center"
                    alt="register"
                    illustrate="register"
                />
            </div>
        </div>
    )
}
