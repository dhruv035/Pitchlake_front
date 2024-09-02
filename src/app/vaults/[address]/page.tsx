"use client";
import classes from "./page.module.css";
import { Vault } from "@/components/Vault/Vault";

export default function Home({
  params: { address: vaultAddress },
}: {
  params: { address: string };
}) {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <Vault vaultAddress={vaultAddress} />
    </div>
  );
}
