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
                    }).catch(error => {
                        
                        setShowWarning(true);
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
            console.log(getUniqueRecordingList(recordingsInfoForNonEmptyWords, 0, uniqueRecordingList, new Set()))
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

    const handleSubmit = (numWords) =>{
        setRecordings([]) // The on resubmit the old table was showing up for a split second before a rerender
        fetchWords(numWords)
    }

    const showSpinnerHandler = () => {
        setShowSpinner(true);
        setShowWarning(false)
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
        <div className="ui container" style={{marginTop:'5px'}}>
            <Input handleSubmit={handleSubmit} spinnerHandler={showSpinnerHandler}/>
            <div className="ui medium header">Fetched Random Words:</div>
                {showSpinner ? <Spinner/> : <WordsList words={words}/>}
                {recordings.length > 0 && !showSpinner && <FinalTable records={recordings}/>}
                {showWarning && (<div className="ui warning message">Not all recordings could be loaded. Please wait a bit before you try again </div>)}
        </div>
    );
}

export default App;