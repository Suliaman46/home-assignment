import React from "react";

const FinalTable =({records})=>{
    const renderedTableContent = records.map((entry) =>{
 
            return (
                <tr key={entry.id}>
                    <td>{entry.word}</td>
                    <td>{entry.title}</td>
                    <td>{entry.artist}</td>
                    <td>{entry.album}</td>
                </tr>

            )
        
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