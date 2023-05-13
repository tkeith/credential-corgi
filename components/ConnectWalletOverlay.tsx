// components/ConnectWalletOverlay.tsx
import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWalletOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex items-center p-4 bg-white border-2 border-corgi rounded-xl w-96 h-48 p-8">
        <Image
          src="/corgi-logo.png"
          alt="Corgi Logo"
          width={100}
          height={100}
        />
        <span className="ml-8 text-corgi font-semibold">
          <ConnectButton />
        </span>
      </div>
    </div>
  );
};
