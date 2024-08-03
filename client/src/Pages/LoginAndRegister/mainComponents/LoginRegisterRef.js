import React from "react";

export default function LoginRegisterRef({className, content, link, linkContent}) {
    return(
        <div className={className}>
            <span>{content} <a href={link}>{linkContent}</a></span>
        </div>
    );
}