import React from "react";
import logo from '../assets/TuskyPulseLogo.webp';
import IllustrationsLoginRegister from "../mainComponents/IllustrationsLoginRegister";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import FormInput from "../mainComponents/FormInput";
import { useState } from "react";
import SendResetEmailBtn from '../mainComponents/SendResetEmailBtn';
import LoginRegisterRef from "../mainComponents/LoginRegisterRef";
import '../mainLoginRegStyling.scss'

export default function ForgetPassword() {
    let [userInformation, setUserInfo] = useState({
        email: "",
        sent: false
    })
    function handleSendResetEmail(e) {
        setUserInfo({...userInformation, email:e.target.value})
    }
    function handleSubmit(e) {
        e.preventDefault();
        setUserInfo({...userInformation, sent: true});
        // Write your send reset email login
    }
    return(
        <div className="main-page flex-center">
            <div className="form-background backgroundProps flex-center">
                <div className="auth-form">
                    <img src={logo} alt="logo"></img>
                    <h2 style={{fontSize: "20px", marginBottom: "20px"}}>Forgot Password</h2>
                    {!userInformation.sent && 
                        <div className="reset-password-instructions">
                            <p>Enter your email address and we'll send you an email with instructions to reset your password.</p>
                        </div>
                    }
                    <form method="post" onSubmit={(e) => {handleSubmit(e)}}>
                        <FormInput
                            className="user-info"
                            icon={faEnvelope} handler={handleSendResetEmail}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                        <SendResetEmailBtn className="SendResetEmailBtn-btn" type="submit" content="Reset"/>
                        <LoginRegisterRef
                            className="login-ref"
                            content="Return to"
                            link='/login'
                            linkContent="Log in!"
                        />
                        {userInformation.sent && 
                            <div className="reset-password-instructions">
                                <p>Email Sent Successfully</p>
                            </div>
                        }
                    </form>
                </div>
                <IllustrationsLoginRegister
                    className="form-illustration flex-center"
                    alt="resetPassword"
                    illustrate="resetPassword"
                />
            </div>
        </div>
    )
}
