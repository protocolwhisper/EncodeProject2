import { ethers } from 'ethers';
import BallotJson from '../abi/Ballot.json';
import * as dotenv from 'dotenv';
dotenv.config();

const assignedVoters = ['0x18bddbacd6e0e4f70c4894b56f8c8b563e6a6a4d', '0xf7e956CE22F73E9FeF8aC920Eb5b9547893D353D', '0x67A27C624ac5c0F753259e9dA4cd007E4E7b3eA7', '0xaF2080020Ba4533ab14FBE5baE24225E0879426F' ] // protocolwhisper.eth, jovi's address #2, jovi's address #3, jovi's address #1
const ballotContractAddress = '0x06C21eEC96ac65cc58717d1EA90F373d9553e659';

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

  async function main() {
   
    const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY);
    const lastBlock = await provider.getBlock("latest");
    console.log({lastBlock});
    const privateKey: string = process.env.PRIVATE_KEY2 as string;
    
    console.log("Delegating Ballot contract votes");
    const wallet = await new ethers.Wallet( privateKey, provider);
    const signer = wallet.connect(provider);

    const ballotContract = new ethers.Contract(ballotContractAddress, BallotJson.abi, signer)
  
    console.log(`Ballot contract succesfully found at ${ballotContract.address}`)
    

    const giveRightToVoteTx = await ballotContract.delegate(assignedVoters[3], {gasLimit: 5000000});
    const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
    console.log(`${assignedVoters[3]} has succesfully received voting rights`);
    console.log({giveRightToVoteTxReceipt});

  
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });