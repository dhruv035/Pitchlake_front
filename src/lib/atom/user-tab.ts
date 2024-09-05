import { atom } from "jotai";
import { VaultUserRole } from "../types";

const vaultUserType = atom<VaultUserRole>(VaultUserRole.Provider);

export { vaultUserType };
