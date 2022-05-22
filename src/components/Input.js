import React, { useState } from "react";


const Input = (props) =>{
    const [numWords, setNumWords] = useState(1);
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const onSubmit =(event)=>{
        event.preventDefault();        
        props.spinnerHandler();
        props.handleSubmit(numWords);
        // setButtonDisabled(true);
        // setTimeout(( ) => setButtonDisabled(false), 1000);
    }

    return (
        <div className="ui segment">
            <form className="ui form" onSubmit={onSubmit}>
                <div className="field">
                    <label>No of Words</label>
                    <input type={`number`} value ={numWords} onChange={(e) => setNumWords(e.target.value)} min={1} max={15}></input>
                    <span className="validity"></span>
                </div>
                <button className="ui secondary button" type="submit"  disabled={buttonDisabled}>Go</button>
            </form>
        </div>
    );
}

export default Input;