import React, { useEffect, useState } from "react";

import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";
import musicBrainz from "../apis/musicBrainz";
import FinalTable from "./FinalTable";
import Spinner from "./Spinner";
import WordsList from "./WordsList";
import getUniqueRecordingList from "../helpers/uniqueValidation";


const App = ()=>{
    const [words, setWords] = useState([])
    const [recordings, setRecordings] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    const [showWarning, setShowWarning] = useState('')

    const handleSubmit = (numWords) =>{
        if(recordings.length>0) setRecordings([]) //  On resubmit the old table was showing up for a split second before a rerender
        fetchWords(numWords)
    }

    const fetchWords = async (num) =>{
        const promises =[]
        for(let i =0; i< num; i++) {
            promises.push(randomWordsAPI.get(`/word?${new Date().getTime()}${Math.random()}`))
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
        }).catch((error) =>{
            throw new Error(`Random word API threw error: ${error.message}`);
        })
    }

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

    useEffect(()=> {

        const fetchRecordings = async () =>{

            const responses = []
            await words.reduce(async (promise, word) =>{
                await promise;
                    const response = await musicBrainz.get('/recording',{
                        params : {
                            query: word,
                            limit: '3',
                            fmt:'json'
                        }
                    }).catch(error => {
                        
                        setShowWarning('Not all recordings could be loaded. Please wait a bit before you try again.');
                        throw new Error(`Recording for ${word} threw error: ${error.message}`);
                    });
                    responses.push(response.data.recordings)
            },Promise.resolve())

            //LOGIC FOR VALIDATING UNIQUENESS //

            const recordingsWithWords = responses.map((e,i) =>{
            return {'recordings': e,'word': words[i]};
            })

            const recordingsInfoForEmptyWords =  recordingsWithWords.filter((e)=>e.recordings.length === 0).map(e=>{
                return {word: e.word, title: 'No Recording Found!', id: e.word}
            })
            const recordingsInfoForNonEmptyWords = recordingsWithWords.filter((e)=>e.recordings.length>0).map(e=>{
                return e.recordings.map((recording)=>{
                    return  {word: e.word,title: recording.title,id: recording.id, artist: recording['artist-credit'][0].artist.name, album: recording.releases[0]['release-group'].title}
                })
            })

            let uniqueRecordingList = []
            if(getUniqueRecordingList(recordingsInfoForNonEmptyWords, 0, uniqueRecordingList, new Set()) === false){
                //Not possible to create a unique selection from record list // Highly Improbable case
                setShowWarning('Could not uniquely select recordings. Please try again!')
                
            } 
            const finalRecordingsList = uniqueRecordingList.concat(recordingsInfoForEmptyWords)
            
            finalRecordingsList.sort((a,b)=> {
                if(a.word < b.word ) return -1
                if(a.word > b.word) return 1
                return 0
            })
            setRecordings(finalRecordingsList)
        }
        if(words.length > 0){
            fetchRecordings();
        }
    },[words]);

    const showSpinnerHandler = () => {
        setShowSpinner(true);
        setShowWarning('')
      };

    return (
        <div className="ui container" style={{marginTop:'5px'}}>
            <Input handleSubmit={handleSubmit} spinnerHandler={showSpinnerHandler}/>
            <div className="ui medium header">Fetched Random Words:</div>
                {showSpinner ? <Spinner/> : 
                    <div> 
                        <WordsList words={words}/>
                        {recordings.length > 0 && <FinalTable records={recordings}/>}
                    
                    </div>
                }
                {showWarning && (<div className="ui warning message">{showWarning}</div>)}
        </div>
    );
}

export default App;