import React from "react";
export default function({rounded, color="", onClick=()=>{}, children}){
    return <button className={`button ${rounded ? "rounded" : ""} ${color}`} onClick={onClick}>{children}</button>
}