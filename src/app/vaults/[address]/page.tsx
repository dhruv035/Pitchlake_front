
import { Vault } from "@/components/Vault/Vault";

export default function Home({
  params: { address: vaultAddress },
}: {
  params: { address: string };
}) {
  return (
      <Vault vaultAddress={vaultAddress} />

  );
}
