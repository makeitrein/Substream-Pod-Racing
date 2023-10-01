export enum ChainName {
  EthereumMainnet = "Ethereum Mainnet",
  EthereumGoerli = "Ethereum Görli",
  EthereumSepolia = "Ethereum Sepolia",
  PolygonMainnet = "Polygon Mainnet",
  MumbaiTestnet = "Mumbai Testnet",
  BNB = "BNB",
  ChapelTestnet = "Chapel Testnet",
  NEARMainnet = "NEAR Mainnet",
  NEARTestnet = "NEAR Testnet",
}

export const chainNames: ChainName[] = [
  ChainName.EthereumMainnet,
  ChainName.EthereumGoerli,
  ChainName.EthereumSepolia,
  ChainName.PolygonMainnet,
  ChainName.MumbaiTestnet,
  ChainName.BNB,
  ChainName.ChapelTestnet,
  ChainName.NEARMainnet,
  ChainName.NEARTestnet,
];

export const pinaxChainToFirehose: Record<ChainName, string> = {
  [ChainName.EthereumMainnet]: "eth.substreams.pinax.network:9000",
  [ChainName.EthereumGoerli]: "goerli.substreams.pinax.network:9000",
  [ChainName.EthereumSepolia]: "sepolia.substreams.pinax.network:9000",
  [ChainName.PolygonMainnet]: "polygon.substreams.pinax.network:9000",
  [ChainName.MumbaiTestnet]: "mumbai.substreams.pinax.network:9000",
  [ChainName.BNB]: "bsc.substreams.pinax.network:9000",
  [ChainName.ChapelTestnet]: "bsc.substreams.pinax.network:9000",
  [ChainName.NEARMainnet]: "near.substreams.pinax.network:9000",
  [ChainName.NEARTestnet]: "neartest.substreams.pinax.network:9000",
};

export const sfChainToFirehose: Record<ChainName, string> = {
  [ChainName.EthereumMainnet]: "mainnet.eth.streamingfast.io:443",
  [ChainName.EthereumGoerli]: "goerli.eth.streamingfast.io:443",
  [ChainName.EthereumSepolia]: "sepolia.eth.streamingfast.io:443",
  [ChainName.PolygonMainnet]: "polygon.streamingfast.io:443",
  [ChainName.MumbaiTestnet]: "mumbai.streamingfast.io:443",
  [ChainName.BNB]: "bnb.streamingfast.io:443",
  [ChainName.ChapelTestnet]: "",
  [ChainName.NEARMainnet]: "mainnet.near.streamingfast.io:443",
  [ChainName.NEARTestnet]: "testnet.near.streamingfast.io:443",
};
