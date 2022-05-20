import React, { useState } from "react";
import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";


const App = ()=>{
    const [words, setWords] = useState([])

    const sendRequest = async (num) =>{
        const responses = [];
        for(let i =0; i< num; i++) {
            let response = await randomWordsAPI.get('word')
            responses.push(response.data[0].word);
        }
        setWords(responses);
        console.log(responses)

    }

    const handleSubmit = (numWords) =>{
        sendRequest(numWords)
    }

    const renderedWords = words.map((word) =>{
        return (                    
        <div className="col-md-auto">
            <div className="ui segment">
                {word}
            </div>
        </div>
        );
    })

    return (
        <div className="ui container">
            <Input handleSubmit={handleSubmit}/>
            <div className="ui medium header">Fetched Random Words:</div>
                <div class="ui equal width grid">
                    {renderedWords}
                </div>
        </div>
    );
}

export default App;