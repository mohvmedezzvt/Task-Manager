import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FormInput({className, icon, handler, id, type, placeholder}) {
    return(
        <div className={className}>
            <div className="icon flex-center">
                <FontAwesomeIcon icon={icon}/>
            </div>
            <input id = {id} type={type} placeholder={placeholder} onChange={(e)=> {handler(e)}}></input>
        </div>
    );
}
