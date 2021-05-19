const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');

http.get('http://localhost:3000/mineBlocks', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {

        // the encrypted invoice is stored in data
        data = JSON.parse(data);
        console.log(data)

        previousHash = data[0].previousHash

        // generates the IPFS hash from the data sent by the API and send it back
        var IPFSHash = crypto.createHash('sha256').update(data[0].encryptedData).digest("hex")


        data = {
            id: 'miner1',
            password: 'miner1',
            invoiceId: data[0].invoiceId,
            IPFSHash: IPFSHash,
            previousHash: previousHash
        }

        fs.appendFileSync(data.id + 'csv', previousHash + ',' + IPFSHash + '\n');

        axios
            .post('http://localhost:3000/mineBlocks', data)
            .then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            })


    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});