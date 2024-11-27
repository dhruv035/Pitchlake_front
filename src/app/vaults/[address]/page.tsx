"use client";
import { Vault } from "@/components/Vault/Vault";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { useEffect } from "react";

export default function Home({
  params: { address },
}: {
  params: { address: string };
}) {
  const { setVaultAddress } = useProtocolContext();

  useEffect(() => {
    console.log("address changed 245");
    if (address) {
      setVaultAddress(address);
    }
  }, [address]);

  return <Vault />;
}
