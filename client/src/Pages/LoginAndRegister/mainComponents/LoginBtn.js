import React from "react";

export default function LoginBtn({className, type, content}) {
    return(
        <div className={className}>
            <button type={type}>{content}</button>
        </div>
    );
}