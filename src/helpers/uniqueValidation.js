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

export default getUniqueRecordingList;