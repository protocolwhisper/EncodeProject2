import { ethers } from 'ethers';
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const assignedVoters = ['0x18bddbacd6e0e4f70c4894b56f8c8b563e6a6a4d', '0xf7e956CE22F73E9FeF8aC920Eb5b9547893D353D', '0x67A27C624ac5c0F753259e9dA4cd007E4E7b3eA7' ] // protocolwhisper.eth, jovi's address #2, jovi's address #3
    
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
  const privateKey: string = process.env.PRIVATE_KEY as string;
  
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const wallet = await new ethers.Wallet( privateKey, provider);
  const signer = wallet.connect(provider);
  const ballotFactory = new Ballot__factory();
  const ballotContract = await ballotFactory.connect(signer).deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  
  
  for (let index = 0; index < PROPOSALS.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const proposalName = ethers.utils.parseBytes32String(proposal.name);
    console.log({index, proposalName, proposal});
  }

  const chairperson = await ballotContract.chairperson();
  console.log({chairperson});

  const giveRightToVoteTx1 = await ballotContract.giveRightToVote(assignedVoters[0], {gasLimit: 5000000});
    const giveRightToVoteTx1Receipt = await giveRightToVoteTx1.wait();
    console.log(`${assignedVoters[0]} has succesfully received voting rights`);
    console.log({giveRightToVoteTx1Receipt});

  const giveRightToVoteTx2 = await ballotContract.giveRightToVote(assignedVoters[1], {gasLimit: 5000000});
  const giveRightToVoteTx2Receipt = await giveRightToVoteTx2.wait();
  console.log(`${assignedVoters[1]} has succesfully received voting rights`);
  console.log({giveRightToVoteTx2Receipt});

  const giveRightToVoteTx3 = await ballotContract.giveRightToVote(assignedVoters[2], {gasLimit: 5000000});
    const giveRightToVote3TxReceipt = await giveRightToVoteTx3.wait();
    console.log(`${assignedVoters[2]} has succesfully received voting rights`);
    console.log({giveRightToVote3TxReceipt});



}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});