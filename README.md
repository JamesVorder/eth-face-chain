# eth-face-chain
A naive implementation of facial recognition on the Ethereum blockchain.

The eth-face-chain is built by deploying ndarrays, twitter handles, and litecoin public addresses onto a blockchain. This chain lives inside of the Ethereum blockchain, and is held together by the prev_address field in each block. There is one block that must be deployed in order to enable iteration over the eth-face-chain. Master contract holds the latest Face contract address deployed to the eth-face-chain in latest_addr. 

⚠️ This is just a POC. Do not make deployments to mainnet. ⚠️

## Pre-Requisites
- Node.js
- Python3

1. `npm install`
2. `pip3 install face_recognition`
3. `npm install -g ethereumjs-testrpc`

