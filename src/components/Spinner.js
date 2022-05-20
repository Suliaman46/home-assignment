import React from "react";

const Spinner = () => {
    return (
        <div className="ui basic segment"  >
            <div className="ui active inverted dimmer" >
                <div className="ui text loader">Loading</div>
            </div>
            <p></p>
         </div>
    );

}

export default Spinner;