import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploySocialMedia: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("SocialMedia", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deploySocialMedia;
deploySocialMedia.tags = ["SocialMedia"]; 