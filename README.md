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

## Interacting with the chain

### Initialize Master
`node ./deployMaster.js`

This will deploy the Master contract, and print the contract address to your terminal. Copy it, and paste it into [config.json](./console/config.json) master_addr field. **This step is necessary to enable proper search functionality. Without Master, no chain can be built. This is where a concencus protocol would typically come in.**

### Add a Face
`node ./addFace.js ~/Path/To/Image.jpg @TwitterHandle *0xyourpublicaddress*`

This will add your face to the blockchain (Or any other faces you want to add.)

### Find a Face
`node ./findFace.js ~/Path/To/Image.jpg`

This will find the address of a given face on the chain. From there, you can pull contact information.

### Retrieve info
`node ./getLTCAddressAtAddress.js *0xaddresstoquery*` gets the LTC address stored at a given address.

`node ./getHandleAtAddress.js *0xaddresstoquery*` gets the Twitter handle at a given address.

`node ./getEncodingAtAddress.js *0xaddresstoquery*` gets the encoding stored at a given address. This can be compared to images on the client's machine using the [facial_recognition](https://github.com/ageitgey/face_recognition) library.
