require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0x0d9eb9b5e0db313bdb89b5ec7a2776fa0b70cdd9";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };


    //sign the transation
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {

        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
            if (!err) {
                console.log("Your transaction hash is: ", hash, "\nCheck Alchemy's Mempool to view the transaction status.");
            } else {
                console.log("Something went wrong when submitting your transaction: ", err)
            }
        });
    }).catch((err) => {
        console.log("Promise failed: ", err);
    });

}

mintNFT("https://gateway.pinata.cloud/ipfs/QmYebRidP1H6QpEEmirsZsdWFNnUxTQN6bVUDgLkZiKXKc");