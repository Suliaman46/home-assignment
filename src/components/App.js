import React, { useEffect, useState } from "react";
import randomWordsAPI from "../apis/randomWordsAPI";
import Input from "./Input";
import musicBrainz from "../apis/musicBrainz";
import FinalTable from "./FinalTable";
import Spinner from "./Spinner";
import WordsList from "./WordsList";


const getUniqueRecordingList = (argArray, index, result, visited)=> {
    if (index === argArray.length) return true;
    for (let item of argArray[index]) {
        if (!visited.has(item)) {
            result.push(item)
            visited.add(item)
            if(getUniqueRecordingList(argArray, index +1, result, visited)){
                return true
            }
            result.pop()
            visited.delete(item)
        }
    }
    return false;
}

const App = ()=>{
    const [words, setWords] = useState([])
    const [recordings, setRecordings] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    const [showWarning, setShowWarning] = useState(false)

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

            const responses = []
            await words.reduce(async (promise, word) =>{
                await promise;
                    const response = await musicBrainz.get('/recording',{
                        params : {
                            query: word,
                            limit: '3',
                            fmt:'json'
                        }
                    }).catch(error => console.log(error));
                    responses.push(response.data.recordings)
            },Promise.resolve())

            //LOGIC FOR VALIDATING UNIQUENESS //

            const recordingsWithWords = responses.map((e,i) =>{
            return {'recordings': e,'word': words[i]};
            })
            
            const recordingsForNonEmptyWords = recordingsWithWords.filter((e)=>e.recordings.length>0)
            const recordingsForEmptyWords =  recordingsWithWords.filter((e)=>e.recordings.length === 0)

            const recordingsRelevantInfoForEmptyWords = recordingsForEmptyWords.map(e=>{
                return {word: e.word, title: 'No Recording Found', id: e.word}
            })
            const recordingsRelevantInfoForNonEmptyWords = recordingsForNonEmptyWords.map(e=>{
                return e.recordings.map((recording)=>{
                    return  {word: e.word,title: recording.title,id: recording.id, artist: recording['artist-credit'][0].artist.name, album: recording.releases[0]['release-group'].title}
                })
            })

            let result = []
            console.log(getUniqueRecordingList(recordingsRelevantInfoForNonEmptyWords, 0, result, new Set()))

            const finalRecordingsList = result.concat(recordingsRelevantInfoForEmptyWords)
            
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
                {/* {showWarning && (<div className="ui warning message">Not all recordings could be loaded. Please try again after a short delay </div>)} */}
        </div>
    );
}

export default App;