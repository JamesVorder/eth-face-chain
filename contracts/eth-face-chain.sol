pragma solidity ^0.4.18;

contract Face {
	int256[] public face_encoding;
	string public twitter_handle;
	string public pubAddress;
	address public prev_address;

	function Face(int256[] enc, string th, string pa) public{
		face_encoding = enc;
		twitter_handle = th;
		pubAddress = pa;
	}

	function getEncoding() public view returns(int256[]){
		return face_encoding;
	}

	function getPrevAddress() public view returns (address){
		return prev_address;
	}

	function setPrevAddress(address new_addr) public{
		prev_address = new_addr;
	}
}

contract Master {
	address latest_face = 0x0000000000000000000000000000000000000000;

	function Master() public{
	}

	function setLatestFace(address new_addr) public{
		latest_face = new_addr;
	}

	function getLatestFace() public view returns(address){
		return latest_face;
	}
}