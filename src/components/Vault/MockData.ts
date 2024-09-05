import { VaultDetailsProps, RoundState } from "@/lib/types";

const mockVaultDetails: VaultDetailsProps = {
  vaultAddress: "0x1234567890abcdef1234567890abcdef12345678",
  status: RoundState.Auctioning,
  strike: 2500,
  tvl: 5000000,
  round: 2,
  timeLeft: "3 days",
  capLevel: 10000000,
  roundID: 10,
  type: "Call",
  fees: 2.5,
  apy: 8.5,
  pnl: 15,
  lastRoundPerf: 12,
  currRoundPerf: 10,
  actions: "withdraw",
  auctionStartDate: new Date("2024-09-01T10:00:00Z"),
  auctionEndDate: new Date("2024-09-03T10:00:00Z"),
  optionSettleDate: new Date("2024-09-05T10:00:00Z")
};

const mockHistoryItems = [
  { address: '0xa1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7', options: 13, pricePerOption: 0.3, total: 3.9 },
  { address: '0xb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', options: 8, pricePerOption: 0.25, total: 2.0 },
  { address: '0xc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', options: 20, pricePerOption: 0.28, total: 5.6 },
  { address: '0xd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1', options: 5, pricePerOption: 0.35, total: 1.75 },
];

export { mockVaultDetails, mockHistoryItems };