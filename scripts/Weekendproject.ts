import { Contract } from "ethers";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
// import * as dotenv from "dotenv"
//dotenv.config()
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
    const accounts = await ethers.getSigners()
    console.log("Deploying Ballot contract")
    console.log("Proposals: ")
    PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
    const ballotFactory = await ethers.getContractFactory("Ballot")
    const bytesArray = PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
    const ballotContract = await ballotFactory.deploy(bytesArray) as Ballot // It wasn't working without it 
    await ballotContract.deployed()
    // For giving voting rigths
    const giveRigth = await ballotContract.giveRightToVote(accounts[1].address)
    const giveRigthtx = await giveRigth.wait()
    const voter = await ballotContract.voters(accounts[1].address)
    const weigth = (voter.weight).toNumber()
    if(weigth !=0) {
        console.log(`The account ${accounts[1].address} has the rigth to vote`)
    }
    // For casting Votes

    // For delegate votes 
    const delegate = await ballotContract.connect(accounts[1].address).delegate(accounts[2].address)
    const delegatereceipt = await delegate.wait()
    const voterDelegate = await ballotContract.voters(accounts[2].address)
    const weigthDelegate = (voterDelegate.weight).toNumber()
    console.log(weigthDelegate)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });