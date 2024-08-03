import React from "react";
import loginIllusration from '../assets/Login-amico-min.webp';
import RegisterIllusration from '../assets/Sign up-amico-min.webp';
import ResetPassword from '../assets/ResetPassword-min.webp'

export default function illustrationsLoginRegister({illustrate, className}) {
    if (illustrate === "login") {
        return(
            <div className={className}>
                <img src={loginIllusration} alt={illustrate} />
            </div>
        )
    } else if (illustrate === "register") {
        return(
            <div className={className}>
                <img src={RegisterIllusration} alt={illustrate} />
            </div>
        )
    }
    return(
        <div className={className}>
            <img src={ResetPassword} alt={illustrate} />
        </div>
    )
}