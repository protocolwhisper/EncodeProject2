import { ethers } from 'ethers';
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
import fs from "fs"
import path from "path"
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
// const assignedVoters = ['0x18bddbacd6e0e4f70c4894b56f8c8b563e6a6a4d', '0xf7e956CE22F73E9FeF8aC920Eb5b9547893D353D', '0x67A27C624ac5c0F753259e9dA4cd007E4E7b3eA7' ] // protocolwhisper.eth, jovi's address #2, jovi's address #3
    
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
   
  const provider = new ethers.providers.AlchemyProvider('goerli', process.env.GOERLI_RPC_URL);
  //const lastBlock = await provider.getBlock("latest");
  // console.log({lastBlock});
  const privateKey: string = process.env.PRIVATE_KEY as string;
  
  console.log("Voting");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const wallet = await new ethers.Wallet( privateKey, provider);
  const signer = wallet.connect(provider);
  const address = '0x06C21eEC96ac65cc58717d1EA90F373d9553e659'
  const dir = path.resolve(
    __dirname,
    "../abi.json"
  )
  const file = fs.readFileSync(dir, "utf8")
  const json = JSON.parse(file)
  const abi = json.abi
  const contract = new ethers.Contract(address, abi , signer)
  const gas = {
    gasLimit: 5000000
  }
  const votenow = await contract.vote(1,gas)

  const votenowre = await votenow.wait()
  console.log(`You vote for ${votenow}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});