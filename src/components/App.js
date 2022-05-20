import React, { useEffect, useState } from "react";
import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";
import musicBrainz from "../apis/musicBrainz";
import FinalTable from "./FinalTable";
import Spinner from "./Spinner";

const App = ()=>{
    const [words, setWords] = useState([])
    const [recordings, setRecordings] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    console.log(showSpinner)

    const fetchWords = async (num) =>{
        const promises =[]
        for(let i =0; i< num; i++) {
            promises.push(randomWordsAPI.get('word'))
            // responses.push(response.data[0].word);
        }
        Promise.all(promises).then((responses) =>{

            // const toAdd = responses.map((response) =>{
            //     response.data[0].word
            // })
            // setWords(toAdd)

            const toAdd = responses.map(response =>{
                return (response.data[0].word)
            })
            setShowSpinner(false);
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

    const showSpinnerHandler = () => {
        setShowSpinner(true);
      };

    useEffect(()=> {

        const fetchRecordings = async () =>{
            Promise.all(words.map(word=>{
                return (
                    musicBrainz.get('/recording',{
                        params : {
                            query: word,
                            limit: '1',
                            fmt:'json'
                        }
                    })
                )
            })).then( (responses) =>{
                const toAdd = responses.map(response =>{
                    
                    const {data : {recordings}} = response
                    console.log(recordings);
                    return (recordings.length > 0 ? {'title': recordings[0].title, 'artist': recordings[0]["artist-credit"][0].artist.name, 'album':recordings[0].releases[0]["release-group"].title, 'id':recordings[0].id} : 'No recording found')
                })
                const recodingsWithWords = toAdd.map((e,i) =>{
                    return {'recording': e,'word': words[i]};
                })
                setRecordings(recodingsWithWords)
                        })
            
        }
        if(words.length > 0){
            fetchRecordings();
        }
    },[words]);

    return (
        <div className="ui container">
            <Input handleSubmit={handleSubmit} spinnerHandler={showSpinnerHandler}/>
            <div className="ui medium header">Fetched Random Words:</div>
               {showSpinner ? <Spinner/> :<div className="ui equal width grid" style={{ padding: '10px'}}>
                    {renderedWords}
                </div>}
                { recordings.length > 0 && !showSpinner && <FinalTable records={recordings}/>}
                
        </div>
    );
}

export default App;