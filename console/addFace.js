fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
var compiledCode = solc.compile(code);
var abiDefinition = JSON.parse(compiledCode.contracts[':Face'].interface)

var face = {
    "abiDefinition": abiDefinition,
    "compiledCode": compiledCode
};

abiDefinition = JSON.parse(compiledCode.contracts[':Master'].interface)

var master = {
    "abiDefinition": abiDefinition,
    "compiledCode": compiledCode
};

var spawn = require("child_process").spawn;
var py = spawn('python3',[config.project_dir + "/getFaceEncoding.py", process.argv[2]]);
py.stdout.on('data', function(data){
    addFace(data.toString().replace("]", "").replace("[", ""), process.argv[3], process.argv[4], config.master_addr);
});
py.stderr.on('data', function(err){
   console.log(err.toString());
});

function addFace(face_encoding_str, twitter_handle, pubAddress, master_addr){
	web3.eth.getAccounts().then(function(from_accounts){

        //convert the string face_encoding into an array of numbers
        var face_encoding = face_encoding_str.split(',');
        for(var point in face_encoding){
            face_encoding[point] = Number(face_encoding[point]);
        }
        var FaceContract = new web3.eth.Contract(face.abiDefinition);
	    //deploy the new face contract with the face_encoding
		FaceContract.deploy({
			data: "0x" + face.compiledCode.contracts[':Face'].bytecode,
			arguments: [ face_encoding, twitter_handle, pubAddress ]
		}).send({
			from: from_accounts[0],
			gas: 4500000000
		},function(err, txH){
			if(err){
				console.log(err);
			} else{
				console.log("OG callback says: " + txH);
			}
		})
		.on('error', function(error){
			console.log("Error callback says: " + error);
		})
		.on('transactionHash', function(txH){
			console.log("transactionHash callback says:" + txH);
		})
		.on('receipt', function(receipt){
			console.log("receipt callback says: " + receipt.contractAddress);
			updatePrevFace(new web3.eth.Contract(face.abiDefinition, receipt.contractAddress)).then(function(data, error){
			    if(error){
			        console.log(error);
                } else{
                    updateLatestFace(data.toString())
                }
            });
		});
	});
}

function updatePrevFace(face){
    return new Promise(function(resolve, reject){
        var MasterContract = new web3.eth.Contract(master.abiDefinition, config.master_contract);
        MasterContract.methods.getLatestFace().call().then(function(data, error){
            if(error){
                reject(error.toString());
            } else{
                web3.eth.getAccounts().then(function(from_accounts) {
                    face.methods.setPrevAddress(data.toString()).send({from: from_accounts[0]})
                        .on('error', function (error) {
                            resolve(error.toString());
                        })
                        .on('receipt', function () {
                            resolve(face.options.address);
                        });
                });
            }
        });
    });
}
function updateLatestFace(latest){
    web3.eth.getAccounts().then(function(from_accounts) {
        var MasterContract = new web3.eth.Contract(master.abiDefinition, config.master_contract);
        MasterContract.methods.setLatestFace(latest).send({from:from_accounts[0]})
            .on('error', function(error){
                console.log(error);
            })
            .on('receipt', function(receipt){
                console.log(receipt);
            });
    });
}
