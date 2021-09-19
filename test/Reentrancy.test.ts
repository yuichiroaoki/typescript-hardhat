import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Reentrancy__factory, Reentrancy } from "../typechain";

describe("Reentrancy", () => {
  let Reentrancy: Reentrancy;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const provider = ethers.provider;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const ReentrancyFactory = (await ethers.getContractFactory(
      "Reentrancy",
      owner
    )) as Reentrancy__factory;
    Reentrancy = await ReentrancyFactory.deploy();
    await Reentrancy.deployed();
  });

  it("Should increase the balance of the contract", async () => {
    expect(await provider.getBalance(Reentrancy.address)).to.equal(
      ethers.BigNumber.from(0)
    );

    const transactionHash = await owner.sendTransaction({
      to: Reentrancy.address,
      value: ethers.utils.parseEther("1.0"),
    });

    expect(await provider.getBalance(Reentrancy.address)).to.equal(
      ethers.utils.parseEther("1.0")
    );
  });

  it("Should be reverted because it is not called by the owner", async () => {
    expect(await Reentrancy.owner()).to.equal(owner.address);

    const transactionHash = await owner.sendTransaction({
      to: Reentrancy.address,
      value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });

    await expect(
      Reentrancy.connect(addr1).withdraw(
        owner.address,
        ethers.utils.parseEther("1.0")
      )
    ).to.be.reverted;
  });
});
