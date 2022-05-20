import React from "react";

const FinalTable =({records})=>{
    const renderedTableContent = records.map((entry) =>{

        if(typeof(entry.recording) === 'string') {
            return (
                <tr >
                    <td>{entry.word}</td>
                    <td>{entry.recording}</td>
                    <td></td>
                    <td></td>
                </tr>
            )

        }
        else {
            return (
                <tr key={entry.recording.id}>
                    <td>{entry.word}</td>
                    <td>{entry.recording.title}</td>
                    <td>{entry.recording.artist}</td>
                    <td>{entry.recording.album}</td>
                </tr>

            )
        }
    })


    return(
        <table className="ui celled table" >
            <tbody id="section1" style={{textAlign: "center"}}>
                <tr>
                    <th>Word</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                </tr>
            </tbody>
            <tbody id="section2" style={{textAlign: "center"}}>
                {renderedTableContent}
            </tbody>
        </table>
    )

}

export default FinalTable;