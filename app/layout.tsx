"use client";

import "./globals.css";
import { GlobalStateProvider } from "./page";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  optimismGoerli,
  scrollTestnet,
  gnosis,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const mantleTestnet = {
  id: 5001,
  name: "Mantle Testnet",
  network: "Mantle Testnet",
  iconUrl: "https://i.imgur.com/Q3oIdip.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BIT",
    symbol: "BIT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Testnet Explorer",
      url: "https://explorer.testnet.mantle.xyz",
    },
  },
  testnet: true,
};

const neonlabs = {
  id: 245022926,
  name: "Neon Labs",
  network: "Neon Labs",
  nativeCurrency: {
    decimals: 18,
    name: "NEON",
    symbol: "NEON",
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.neonevm.org"],
    },
    public: {
      http: ["https://devnet.neonevm.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neon Explorer",
      url: "https://neonscan.org/",
    },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    optimism,
    polygon,
    gnosis,
    scrollTestnet,
    optimismGoerli,
    mantleTestnet,
    neonlabs,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "39027ae4b130533553e7eecf7bea05cb",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"bg-white"}>
        <GlobalStateProvider>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
          </WagmiConfig>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
