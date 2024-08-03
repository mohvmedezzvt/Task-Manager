import React from "react";
import googleIcon from '../assets/googleIcon.webp';

export default function GoogleAuth() {
    return(
        <div className="google-auth flex-center">
            <a href="/" className="flex-center">
                <div className="google-signIn flex-center">
                    <img src={googleIcon} alt="google-signIn"></img>
                </div>
                <span>Goolge</span>
            </a>
        </div>
    );
}