import { expect } from "chai";
import { ethers } from "hardhat";
import  {Ballot}  from "../typechain-types";

const PROPOSALS = ["Proposal 1","Proposal 2","Proposal 3"]

describe("Ballot" , function(){
    let ballotContract: Ballot
    beforeEach(async function (){
        const ballotFactory = await ethers.getContractFactory("Ballot")
        const bytesArray = PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
        ballotContract = await ballotFactory.deploy(bytesArray) as Ballot // It wasn't working without it 
        await ballotContract.deployed()
        
   })

    describe("When the contract is deployed" , function() {
        it("has the provided proposals" , async function() {
            //Since solidity can't return the whole array we need to do a functions
            for(let index = 0; index < PROPOSALS.length ; index++) {
                const returnedArray = await ballotContract.proposalNames(index)
                expect(ethers.utils.parseBytes32String(returnedArray)).to.equal(PROPOSALS[index])
            }
        })
        


    })
})