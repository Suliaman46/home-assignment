const getUniqueRecordingList = (argArray, index, result, visited)=> {
    if (index === argArray.length) return true;
    for (let item of argArray[index]) {
        if (!visited.has(item.id)) {
            result.push(item)
            visited.add(item.id)
            if(getUniqueRecordingList(argArray, index +1, result, visited)){
                return true
            }
            result.pop()
            visited.delete(item.id)
        }
    }
    return false;
}

export default getUniqueRecordingList;