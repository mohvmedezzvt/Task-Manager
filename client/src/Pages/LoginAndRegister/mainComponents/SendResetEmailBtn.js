import React from "react";

export default function RegisterBtn({className, type, content}) {
    return(
        <div className={className}>
            <button type={type}>{content}</button>
        </div>
    );
}
