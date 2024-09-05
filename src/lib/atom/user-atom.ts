import { atomWithStorage } from "jotai/utils";

export type UserState = {
  address: string;
  balance: Balances;
};

type Balances = {
  locked: number;
  unlocked: number;
  stashed: number;
};

const initState: UserState = {
  address: "",
  balance: {
    locked: 0,
    unlocked: 0,
    stashed: 0,
  },
};

const USER_DATA = "USER_DATA";

const userAtom = atomWithStorage<UserState>(USER_DATA, initState);

export { userAtom };
