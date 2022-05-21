import React, { useEffect, useState } from "react";
import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";
import musicBrainz from "../apis/musicBrainz";
import FinalTable from "./FinalTable";
import Spinner from "./Spinner";
import WordsList from "./WordsList";

const App = ()=>{
    const [words, setWords] = useState([])
    const [recordings, setRecordings] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    const fetchWords = async (num) =>{

        const promises =[]
        for(let i =0; i< num; i++) {
            promises.push(randomWordsAPI.get(`/word?${new Date().getTime()}${Math.random()}`))
            // promises.push(randomWordsAPI.get(`/word?${new Date().getTime()}`))
        }
        Promise.all(promises).then((responses) =>{

            const reducedFetchedWordsList = responses.reduce((result, response) =>{
                if(typeof(response.data) == 'object'){
                    return result.concat(response.data[0].word)
                }
                return result
            },[])

            const uniqueFetchedWordsList = new Set(reducedFetchedWordsList)
            const diff = reducedFetchedWordsList.length - uniqueFetchedWordsList.size

            if( diff > 0 || reducedFetchedWordsList.length < num) {
                handleDuplicates(uniqueFetchedWordsList, num)
            }
            else {
                setShowSpinner(false);
                setWords(reducedFetchedWordsList.sort())
            }
        })

    }

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

    const handleSubmit = (numWords) =>{
        fetchWords(numWords)
    }

    const showSpinnerHandler = () => {
        setShowSpinner(true);
      };

    const handleDuplicates = async (uniqueWordsList,target) =>{

    const toReturn = [...uniqueWordsList]
    while(toReturn.length < target) {
        let response = await randomWordsAPI.get(`/word`);
        if(!toReturn.includes(response.data[0].word)){
            toReturn.push(response.data[0].word)
        }
        else continue;
    }
    setShowSpinner(false);
    setWords(toReturn.sort())
    }


    return (
        <div className="ui container">
            <Input handleSubmit={handleSubmit} spinnerHandler={showSpinnerHandler}/>
            <div className="ui medium header">Fetched Random Words:</div>
               {showSpinner ? <Spinner/> : <WordsList words={words}/>}
                { recordings.length > 0 && !showSpinner && <FinalTable records={recordings}/>}
        </div>
    );
}

export default App;