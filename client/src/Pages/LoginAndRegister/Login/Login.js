import React from "react";
import logo from '../assets/TuskyPulseLogo.webp';
import LoginBtn from "../mainComponents/LoginBtn";
import LoginRegisterRef from "../mainComponents/LoginRegisterRef";
import IllustrationsLoginRegister from "../mainComponents/IllustrationsLoginRegister";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleAuth from "../mainComponents/googleAuth";
import FormInput from "../mainComponents/FormInput";
import { login } from '../../../api';
import { useState } from "react";
import './Login.scss';
import '../mainLoginRegStyling.scss'

export default function Login() {
    let [userInformation, setUserInfo] = useState({
        email: "",
        password: "",
        rememberMe: false
    })
    const [message, setMessage] = useState('');
    function handleEmailInput(e) {
        setUserInfo({...userInformation, email:e.target.value})
    }
    function handlePasswordInput(e) {
        setUserInfo({...userInformation, password:e.target.value})
    }
    function handleRememberMe(e) {
        setUserInfo({...userInformation, rememberMe:e.target.checked})
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = await login(userInformation.username, userInformation.password);
        if (data.message === 'Login successful') {
            setMessage('Login successful');
        } else {
            setMessage(data.message);
        }
    };
    return(
        <div className="main-page flex-center">
            <div className="form-background backgroundProps flex-center">
                <div className="auth-form">
                    <img src={logo} alt="logo"></img>
                    <h2>Log in to your account</h2>
                    <span>Welcome back! Select your login method</span>
                    <GoogleAuth />
                    <span className="separator">-----------------  or continue with email  -----------------</span>
                    <form method="post" onSubmit={handleSubmit}>
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
                        <div className="remember-forget">
                            <div>
                                <label htmlFor="remember" className="remember" >
                                        <input
                                            type="checkbox"
                                            id = "remember"
                                            checked={userInformation.rememberMe}
                                            onChange={(e)=> {handleRememberMe(e)}}
                                            ></input>
                                        <span className="custom-checkbox"></span>
                                        <span>Remember me</span>
                                </label>
                            </div>
                            <div className="forget">
                                <a href="/forget-password">Forget password?</a>
                            </div>
                        </div>
                        <LoginBtn className="login-btn" type="submit" content="Log in"/>
                        {message && <p>{message}</p>}
                        <LoginRegisterRef
                            className="login-ref"
                            content="Don't have an account?"
                            link='/register'
                            linkContent="Sign Up!"
                        />
                    </form>
                </div>
                <IllustrationsLoginRegister
                    className="form-illustration flex-center"
                    alt="login"
                    illustrate="login"
                />
            </div>
        </div>
    )
}
