import React from "react";

const WordsList =({words}) =>{
    const renderedWords = words.map((word) =>{
        return (
            <div className="col-md-auto" key={word}>
                <div className="ui segment" style={{ marginTop: '3px'}}>
                    {word}
                </div>
            </div>
        );
    })

    return (
        <div className="ui equal width grid" style={{ padding: '10px'}}>
            {renderedWords}
        </div>
        );
}

export default WordsList;