import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Vault__factory,
  Vault,
  ERC20Mock,
  ERC20Mock__factory,
} from "../typechain-types";
import { deployContractFromName, getBigNumber } from "../utils";

describe("Vault", () => {
  let Vault: Vault;
  let SomeErc20Token: ERC20Mock;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    Vault = await deployContractFromName("Vault", Vault__factory);
    SomeErc20Token = await deployContractFromName(
      "ERC20Mock",
      ERC20Mock__factory,
      ["SomeErc20Token", "SET", owner.getAddress(), getBigNumber(1000)]
    );
    await Vault.waitForDeployment();
  });

  it("getBalance()", async () => {
    expect(await Vault.getBalance()).to.equal(0);

    await expect(
      owner.sendTransaction({
        to: Vault.getAddress(),
        value: ethers.parseEther("1.0"),
      })
    )
      .to.emit(Vault, "ReceiveEth")
      .withArgs(await owner.getAddress(), ethers.parseEther("1.0"));

    expect(await Vault.getBalance()).to.equal(getBigNumber(1));
  });

  it("withdrawEth()", async () => {
    await owner.sendTransaction({
      to: Vault.getAddress(),
      value: ethers.parseEther("1.0"), // Sends exactly 1.0 ether
    });

    await expect(
      Vault.withdrawEth(await owner.getAddress(), ethers.parseEther("1.0"))
    )
      .to.emit(Vault, "WithdrawEth")
      .withArgs(await owner.getAddress(), ethers.parseEther("1.0"));
  });

  it("withdrawErc20()", async () => {
    await SomeErc20Token.transfer(Vault.getAddress(), getBigNumber(1));
    await expect(
      Vault.withdrawErc20(
        SomeErc20Token.getAddress(),
        addr1.getAddress(),
        getBigNumber(1)
      )
    )
      .to.emit(Vault, "WithdrawErc20")
      .withArgs(
        await SomeErc20Token.getAddress(),
        await addr1.getAddress(),
        getBigNumber(1)
      );
  });
});
