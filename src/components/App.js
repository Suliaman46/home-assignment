import React, { useEffect, useRef, useState } from "react";
import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";
import musicBrainz from "../apis/musicBrainz";

const App = ()=>{
    const [words, setWords] = useState([])
    const fetchWords = async (num) =>{
        const promises =[]
        for(let i =0; i< num; i++) {
            promises.push(randomWordsAPI.get('word'))
            // responses.push(response.data[0].word);
        }
        Promise.all(promises).then((responses) =>{
            const toAdd = []
            responses.map((response) =>{
                toAdd.push(response.data[0].word)
            })
            setWords(toAdd)
        })

    }


    const handleSubmit = (numWords) =>{
        fetchWords(numWords)
    }

    const renderedWords = words.map((word) =>{
        return (                    
        <div className="col-md-auto" key={word}>
            <div className="ui segment" >
                {word}
            </div>
        </div>
        );
    })

    useEffect(()=> {
        const fetchRecordings = async () =>{
            await Promise.all(words.map(async (word)=> {
                const response = await musicBrainz.get('/recording',{
                    params : {
                        query: word,
                        limit: '1',
                        fmt:'json'
                    }
                });
                console.log(response.data);
            }))
        }
        if(words.length > 0){
            fetchRecordings();
        }
    },[words]);

    return (
        <div className="ui container">
            <Input handleSubmit={handleSubmit}/>
            <div className="ui medium header">Fetched Random Words:</div>
                <div className="ui equal width grid">
                    {renderedWords}
                </div>
        </div>
    );
}

export default App;