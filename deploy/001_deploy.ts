import { parseEther } from "ethers/lib/utils";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, execute } = hre.deployments;

  const blockNumber = await hre.ethers.provider.getBlockNumber();

  const HERA = await deploy("HERA", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`contract: `, HERA.address);

  const Pool = await deploy("Pool", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`contract: `, Pool.address);
  if (Pool.newlyDeployed) {
    await execute(
      "Pool",
      { log: true, from: deployer },
      "initialize",
      HERA.address,
      HERA.address,
      parseEther("2"),
      blockNumber,
      blockNumber + 10_000,
      0,
      deployer,
    );
  }

  await execute("HERA", { log: true, from: deployer }, "transfer", Pool.address, parseEther("10000000"));
  await execute(
    "HERA",
    { log: true, from: deployer },
    "transfer",
    "0x173377Ba4dDC2eAF9cBa567F49DA33Ea31194531",
    parseEther("10000000"),
  );

  const Multicall = await deploy("Multicall", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`contract: `, Multicall.address);

  console.log({ HERA: HERA.address, Pool: Pool.address, Multicall: Multicall.address });
};
export default func;
