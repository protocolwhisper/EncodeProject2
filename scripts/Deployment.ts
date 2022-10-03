import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
// import * as dotenv from "dotenv"
//dotenv.config()
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
    const accounts = await ethers.getSigners()
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
  const ballotFactory = await ethers.getContractFactory("Ballot")
  const bytesArray = PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
  const ballotContract = await ballotFactory.deploy(bytesArray) as Ballot // It wasn't working without it 
  await ballotContract.deployed()
  console.log(`Ballot was deployed to the adders ${ballotContract.address}`)

  const chairperson = await ballotContract.chairperson()
  console.log(`The chair person is ${chairperson}`)

  let voterStructForAccount1 = await ballotContract.voters(accounts[1].address)
  console.log(voterStructForAccount1)
  const giveRigthToVotetx = await ballotContract.giveRightToVote(accounts[1].address)
  const giveRigthToVotetxReceipt = await giveRigthToVotetx.wait()
  console.log(giveRigthToVotetxReceipt)
  console.log("Casting vote for proposal 0 using account 1 ")
  const castVotetx = await ballotContract.connect(accounts[1].address).vote(0)
  const castVotetxReceipt = await castVotetx.wait()
  const proposal0 = await ballotContract.proposals(0)
  const name = ethers.utils.parseBytes32String(proposal0.name)
  console.log({name , proposal0})

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});