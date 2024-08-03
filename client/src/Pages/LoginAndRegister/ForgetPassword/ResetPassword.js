import React from "react";
import logo from '../assets/TuskyPulseLogo.webp';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../mainComponents/FormInput";
import { useState } from "react";
import SendResetEmailBtn from '../mainComponents/SendResetEmailBtn';
import LoginRegisterRef from "../mainComponents/LoginRegisterRef";
import '../mainLoginRegStyling.scss'

export default function ResetPassword() {
    let [userInformation, setUserInfo] = useState({
        passwordOne: "",
        passwordTwo: "",
        showMessage: false,
        message: "", 
        messageColor: ""
    })
    function handlePasswordOneInput(e) {
        setUserInfo({...userInformation, passwordOne:e.target.value})
    }
    function handlePasswordTwoInput(e) {
        setUserInfo({...userInformation, passwordTwo:e.target.value})
    }
    function handleSubmit(e) {
        e.preventDefault();
        if (userInformation.passwordOne === userInformation.passwordTwo) {
            if (userInformation.passwordOne === "") {
                setUserInfo({...userInformation,
                    showMessage: true,
                    message: "Enter your new password",
                    messageColor: "#9d0606"});
            } else {
                setUserInfo({...userInformation,
                            showMessage: true,
                            message: "Password Resetted successfully",
                            messageColor: "rgba(16, 115, 115, 0.8588235294)"});
            }
        } else {
            setUserInfo({...userInformation,
                        showMessage: true,
                        message: "Passwords are not the same",
                        messageColor: "#9d0606"});
        }
    }
    return(
        <div className="main-page flex-center">
            <div className="form-background backgroundProps flex-center">
                <div className="auth-form reset-password-form">
                    <img src={logo} alt="logo"></img>
                    <h2 style={{fontSize: "20px", marginBottom: "20px"}}>Reset Password</h2>
                    {!userInformation.showMessage && 
                        <div className="reset-password-instructions">
                            <p>Enter your new password, and click Reset button.</p>
                        </div>
                    }
                    <form method="post" onSubmit={(e) => {handleSubmit(e)}}>
                        <FormInput
                            className="user-info"
                            icon={faLock} handler={handlePasswordOneInput}
                            id="passwordOne"
                            type="password"
                            placeholder="Enter your new password"
                        />
                        <FormInput
                            className="user-info"
                            icon={faLock} handler={handlePasswordTwoInput}
                            id="passwordTwo"
                            type="password"
                            placeholder="Enter your new password again"
                        />
                        <SendResetEmailBtn className="SendResetEmailBtn-btn" type="submit" content="Reset"/>
                        <LoginRegisterRef
                            className="login-ref"
                            content="Return to"
                            link='/login'
                            linkContent="Log in!"
                        />
                        {userInformation.showMessage && 
                            <div className="reset-password-instructions" style={{backgroundColor: userInformation.messageColor}}>
                                <p>{userInformation.message}</p>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}
