//  https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9

const fs = require('fs')
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelistAddresses = require('./whitelist');

// console.log(whitelistAddresses);

// let whitelistAddresses = [
//     "0xe0bDD1E215D3c7a60aB627E274766EE22e872147",
//     "0x0A029c20cd9548AcB549A36322eb46f7935Cd138",
//     "0x26616dC479D99E019B6173b3c160968B926De682",
//     "0xf34Fa5d03209A4FCcbd9075d18044283BD35d301",
//     "0x9C2BB831B94a1cA2d6cF82Ed19895233036f95F8",
//     "0xE79117fA29a420724D33fbAF8C2b1020955358c2",
//     "0x8931079BdD963b60Ed38B32ae54587b9dFA843d2"
// ]

// leaves, merkleTree, and rootHash are all determined prior to claim. The project
// would have some from of whitelist process where whitelisted addresses are collected
// and known beforehand.

// Creates a new array 'leafNodes' by hashing alll indexes of the 'whitelistAddreses' 
// using keccak256. Then creates a new Merkle Tree object using keccake256 as the 
// desired hashing algorithm.
const leafNodes = whitelistAddresses.map(addr => keccak256(addr));


const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

// Get the root hash of the merkle tree in hex format.
const rootHash = merkleTree.getRoot();
const rootHexHash = merkleTree.getHexRoot();
// console.log(rootHash.toString('utf8'));
console.log('======= root =======', rootHexHash.toString('utf8'));

// console.log('Whitelist Merkle Tree\n', merkleTree.toString());


// Client-side, you would ouse the 'msg.sender' address to query an API that returns
// the merkle proof required to derive the root hash of the Merkle Tree.
const claimingAddress = leafNodes[0];

// 'getHexProof' will return the neighbour leaf and all parent node hashes that will
// be required to dervive the Merkle Trees root hash.
const hexProof = merkleTree.getHexProof(claimingAddress);

console.log('Merkle Proof for Address - ', whitelistAddresses[0])
console.log(hexProof);

// fs.writeFileSync("./proof.txt",merkleTree.toString());

const tree = {}
whitelistAddresses.forEach(address => {
    tree[address] = address;
});
Object.keys(tree).forEach(address => {
    const value = tree[address];
    const proof = merkleTree.getHexProof( keccak256(address))
    tree[address.toLocaleLowerCase()] = {
        // ...value,
        proof
    }
})
// console.log(JSON.stringify(tree))
fs.writeFileSync("./proofList.txt",JSON.stringify(tree));