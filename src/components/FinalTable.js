import React from "react";

const FinalTable =({records})=>{
    const renderedTableContent = records.map((entry) =>{
            return (
                <tr key={entry.id} className={entry.artist ? ``:`warning`}>
                    <td>{entry.word}</td>
                    <td>{entry.title}</td>
                    <td>{entry.artist}</td>
                    <td>{entry.album}</td>
                </tr>

            )
            
    })

    return(
        <table className="ui celled table" >
            <thead  style={{textAlign: "center"}}>
                <tr>
                    <th>Word</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                </tr>
            </thead>
            <tbody id="section2" style={{textAlign: "center"}}>
                {renderedTableContent}
            </tbody>
        </table>
    )

}

export default FinalTable;