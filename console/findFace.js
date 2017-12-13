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
    find(data.toString().replace("[", "").replace("]", "").split(',')).then(function(data, err){
        if(err){
            console.log(err.toString());
        } else{
            console.log(data.toString());
        }
    });
});
py.stderr.on('data', function(err){
    console.log(err.toString());
});

function getLatestFace(){
    return new Promise(function(resolve, reject){
        web3.eth.getAccounts().then(function (from_accounts, error) {
            if(error){
                reject(error);
            } else{
                var MasterContract = new web3.eth.Contract(master.abiDefinition, config.master_contract);
                MasterContract.methods.getLatestFace().call().then(function (addr, error) {
                    if(error){
                        reject(error);
                    } else{
                        resolve(addr);
                    }
                });
            }
        });
    });
}

function find(encoding){
    var parent = this;
    this.encoding = encoding;
    return new Promise(function(resolve, reject){
        getLatestFace().then(function (addr, err) {
            if(err){
                reject(err);
            }else{
                var curr_face = new web3.eth.Contract(face.abiDefinition, addr);
                recurse(curr_face, parent.encoding).then(function(found_addr, error){
                    if(error){
                        parent.reject(error);
                    }else{
                        parent.resolve(found_addr);
                    }
                });
            }
        });
    });
}

function recurse(curr_face, encoding){
    var parent = this;
    this.encoding = encoding;
    return new Promise(function(resolve, reject){
        if(curr_face.options.address == '0x0000000000000000000000000000000000000000') reject("The face was not found.");
        curr_face.methods.getEncoding().call().then(function (curr_encoding, err) {
            if(err){
                reject(err);
            } else{
                var spawn = require("child_process").spawn;
                var py = spawn('python3',[config.project_dir + "/compareEncodings.py", parent.encoding.toString(), curr_encoding.toString()]);
                py.stdout.on('data', function(data, err){
                    if(err) console.log(err);
                    var data_str = data.toString();
                    if(data_str == "True\n"){
                        console.log(curr_face.options.address);
                        resolve(curr_face.options.address);
                    } else{
                        curr_face.methods.getPrevAddress().call().then(function(addr, error){
                            if(error){
                                console.log(error);
                            } else{
                                var prev_face = new web3.eth.Contract(face.abiDefinition, addr);
                                recurse(prev_face, parent.encoding);
                            }
                        });
                    }
                });
                py.stderr.on('data', function(err){
                    console.log(err.toString());
                });
            }
        });
    });
}