class Helpers {
    splitArrayIntoChunks = (array, chunkSize) => {
        let chunks = [];

        // Use a for loop to iterate over the original array and split it into chunks
        for (let i = 0; i < array.length; i += chunkSize) {
            // Use the slice method to create a chunk and push it into the chunk array
            let chunk = array.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        // Return the new array with chunks
        return chunks;
    };

    removeDuplicateKey = (array, key) =>
        array.filter(
            (element, index, arr) => arr.findIndex((el) => el[key] === element[key]) === index
        );
}

module.exports = new Helpers();
