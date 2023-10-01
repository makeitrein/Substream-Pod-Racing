import { authIssue } from "@substreams/core";
import { BlockScopedData, Package } from "@substreams/core/proto";
import { readPackageFromFile } from "@substreams/manifest";
import "dotenv/config";
import { ChainName, pinaxChainToFirehose, sfChainToFirehose } from "./chains";
import { substreamEmitter } from "./emitter";

export function invariant(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

interface PodPackage {
  name: string;
  substreamPackage: Package;
  outputModule: string;
}

interface PodFirehose {
  name: string;
  token: string;
  baseUrl: string;
}

const sfPod = async (): Promise<PodFirehose> => {
  const apiKey = process.env.STREAMINGFAST_KEY;
  invariant(apiKey, "Missing STREAMINGFAST_KEY");

  const AUTH_ISSUE_URL = "https://auth.streamingfast.io/v1/auth/issue";
  const { token } = await authIssue(apiKey, AUTH_ISSUE_URL);
  invariant(token, "Missing token");

  const baseUrl = "https://" + sfChainToFirehose[ChainName.EthereumMainnet];

  return { token, baseUrl, name: "StreamingFast" };
};

const pinaxPod = async (): Promise<PodFirehose> => {
  const apiKey = process.env.PINAX_API_KEY;
  invariant(apiKey, "Missing PINAX_API_KEY");

  const AUTH_ISSUE_URL = "https://auth.pinax.network/v1/auth/issue";
  const { token } = await authIssue(apiKey, AUTH_ISSUE_URL);
  invariant(token, "Missing token");

  const baseUrl = "https://" + pinaxChainToFirehose[ChainName.EthereumMainnet];
  return { token, baseUrl, name: "Pinax" };
};

const podFirehoses = async (): Promise<PodFirehose[]> => [
  await sfPod(),
  await pinaxPod(),
];

const podPackages: PodPackage[] = [
  {
    name: "Chainlink Price Substream",
    substreamPackage: readPackageFromFile(
      "./spkgs/chainlink-price-substream-v1.0.0.spkg"
    ),
    outputModule: "get_chainlink_answers",
  },
  {
    name: "ERC20 Supply Substream",
    substreamPackage: readPackageFromFile("./spkgs/erc20-supply-v0.1.0.spkg"),
    outputModule: "balance_changes:map_balance_changes",
  },
  {
    name: "Uniswap Substream",
    substreamPackage: readPackageFromFile("./spkgs/uniswap-v3-v0.2.8.spkg"),
    outputModule: "map_pools_created",
  },
];

const podRace = async (podPackage: PodPackage, podFirehose: PodFirehose) => {
  try {
    const { substreamPackage, outputModule, name } = podPackage;
    const { token, baseUrl, name: firehoseName } = podFirehose;

    const startBlock = -1000;

    const raceName = `Starting Pod Race: ${outputModule} + ${name} for ${firehoseName}`;
    console.time(raceName);

    const { emitter } = await substreamEmitter({
      substreamPackage,
      token,
      startBlock,
      baseUrl,
      outputModule,
    });

    const blockHandler = (block: BlockScopedData) => {
      console.timeEnd(raceName);
      emitter.off("block", blockHandler);
    };

    emitter.on("block", blockHandler);

    emitter.start();
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  const firehoses = await podFirehoses();

  for (const firehose of firehoses) {
    for (const pkg of podPackages) {
      await podRace(pkg, firehose);
    }
  }
};

main();
