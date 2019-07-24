import React from "react";
export default function({proximal}){
    return <div>
        {Array.isArray(proximal) ? 
        proximal.map((p, i) => 
            <div className="proximal-card" key={i}>
                <div className="name">{p.name}</div>
                <div className="dist">{p.dist}</div>
                <div className="icon"><i className="fa fa-arrow-right"></i></div>
            </div>
        ) : <p><i className="fa fa-sync spinning"></i> Loading</p>}
    </div>
}