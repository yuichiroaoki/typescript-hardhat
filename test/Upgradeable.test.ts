import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import {
  ReentrancyUpgradeable__factory,
  ReentrancyUpgradeable,
  ReentrancyUpgradeableV2,
} from "../typechain";

describe("Upgradeable", () => {
  let Upgradeable: ReentrancyUpgradeable;
  let UpgradeableV2: ReentrancyUpgradeableV2;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const provider = ethers.provider;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const ReentrancyFactory = (await ethers.getContractFactory(
      "ReentrancyUpgradeable",
      owner
    )) as ReentrancyUpgradeable__factory;
    Upgradeable = (await upgrades.deployProxy(ReentrancyFactory, [], {
      initializer: "initialize",
    })) as ReentrancyUpgradeable;
    await Upgradeable.deployed();
  });

  it("Should increase the balance of the contract", async () => {
    expect(await provider.getBalance(Upgradeable.address)).to.equal(
      ethers.BigNumber.from(0)
    );

    await owner.sendTransaction({
      to: Upgradeable.address,
      value: ethers.utils.parseEther("1.0"),
    });

    expect(await provider.getBalance(Upgradeable.address)).to.equal(
      ethers.utils.parseEther("1.0")
    );
  });

  it("Should be reverted because it is not called by the owner", async () => {
    expect(await Upgradeable.owner()).to.equal(owner.address);

    await owner.sendTransaction({
      to: Upgradeable.address,
      value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });

    await expect(
      Upgradeable.connect(addr1).withdraw(
        owner.address,
        ethers.utils.parseEther("1.0")
      )
    ).to.be.reverted;
  });

  it("Should upgrade the contract", async () => {
    const upgradeableV2Factory = await ethers.getContractFactory(
      "ReentrancyUpgradeableV2",
      owner
    );
    await upgradeableV2Factory.deploy();

    await upgrades.upgradeProxy(Upgradeable.address, upgradeableV2Factory);
    UpgradeableV2 = upgradeableV2Factory.attach(
      Upgradeable.address
    ) as ReentrancyUpgradeableV2;
    expect(await Upgradeable.owner()).to.equal(owner.address);

    expect(await UpgradeableV2.greet()).to.eq("Hello World");
  });
});
