import { createRegistry, createRequest } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { BlockEmitter, createDefaultTransport } from "@substreams/node";

interface EmitterProps {
  token: string;
  startBlock: number | bigint | undefined;
  stopBlock?: number | bigint | `+${number}` | undefined;
  outputModule: string;
  baseUrl: string;
  substreamPackage: Package;
}

export async function substreamEmitter({
  token,
  startBlock,
  stopBlock,
  baseUrl,
  substreamPackage,
  outputModule,
}: EmitterProps) {
  // Connect Transport
  const headers = new Headers({ "User-Agent": "@substreams/node" });
  const registry = createRegistry(substreamPackage);
  const transport = createDefaultTransport(baseUrl, token, registry, headers);
  const request = createRequest({
    substreamPackage,
    outputModule,
    startBlockNum: startBlock,
    stopBlockNum: stopBlock,
    // productionMode: true,
  });

  const emitter = new BlockEmitter(transport, request, registry);

  return { emitter };
}
