require("dotenv").config();
import pact from "@pact-foundation/pact-node";
import childProcess from "child_process";

const PACT_BROKER_BASE_URL = process.env.PACT_BROKER_BASE_URL;
const PACT_BROKER_TOKEN = process.env.PACT_BROKER_TOKEN;

const pactsDir = process.argv[2];

if (!pactsDir) {
  throw new Error("No pacts directory provided");
}

const exec = (command: string) =>
  childProcess.execSync(command).toString().trim();

if (PACT_BROKER_BASE_URL === undefined || PACT_BROKER_TOKEN === undefined) {
  throw new Error("Failed to retrieve pact details");
}

const gitSha = exec("git rev-parse HEAD || echo LOCAL_DEV");
const branch =
  process.env.GH_BRANCH ||
  exec("git rev-parse --abbrev-ref HEAD || echo LOCAL_DEV");

const opts = {
  pactFilesOrDirs: [pactsDir],
  pactBroker: PACT_BROKER_BASE_URL,
  pactBrokerToken: PACT_BROKER_TOKEN,
  consumerVersion: gitSha,
  tags: [branch],
  branch: branch,
};

const publishPact = async () => {
  await pact.publishPacts(opts);
};

publishPact().then(() => console.log("Published contracts."));
