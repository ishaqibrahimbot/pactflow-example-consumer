require("dotenv").config();
import pact from "@pact-foundation/pact-node";
import childProcess from "child_process";

const exec = (command: string) =>
  childProcess.execSync(command).toString().trim();

const PACT_BROKER_BASE_URL = process.env.PACT_BROKER_BASE_URL;
const PACT_BROKER_TOKEN = process.env.PACT_BROKER_TOKEN;

if (PACT_BROKER_BASE_URL === undefined || PACT_BROKER_TOKEN === undefined) {
  throw new Error("Failed to retrieve pact details");
}

const gitSha = exec("git rev-parse HEAD || echo LOCAL_DEV");

const pacticipants = [
  {
    name: "teamo-banter-example-consumer",
    version: gitSha,
  },
];

const canDeployOptions = {
  pacticipants,
  pactBroker: PACT_BROKER_BASE_URL,
  pactBrokerToken: PACT_BROKER_TOKEN,
};

const checkDeploy = async () => {
  await pact.canDeploy(canDeployOptions);
};

checkDeploy().then((_) => console.log("Safe to deploy."));
