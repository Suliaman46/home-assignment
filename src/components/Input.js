import React, { useState } from "react";


const Input = (props) =>{
    const [numWords, setNumWords] = useState(1);

    const onSubmit =(event)=>{
        event.preventDefault();
        props.spinnerHandler();
        props.handleSubmit(numWords);
    }

    return (
        <div className="ui segment">
            <form className="ui form" onSubmit={onSubmit}>
                <div className="field">
                    <label>No of Words</label>
                    <input type={`number`} value ={numWords} onChange={(e) => setNumWords(e.target.value)} min={1} max={10}></input>
                    <span className="validity"></span>
                </div>
            </form>
        </div>
    );
}

export default Input;