import { atom } from "jotai";
// Import atomWithStorage and createJSONStorage for session storage
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 1. Define the interface based on your login response
export interface UserSession {
  accessToken?: string;
  user?: any;
  lastVerified?: number;
  lang?: string;
  [key: string]: any;
}

// 2. Create a persisted atom
// Use sessionStorage for Jotai atom
const storage = createJSONStorage<UserSession | null>(() => typeof window !== 'undefined' ? sessionStorage : ({} as any));
export const userSessionAtom = atomWithStorage<UserSession | null>("auth-session", null, storage);

// Your existing atom
export const scrollDirectionAtom = atom<"up" | "down">("up");


export const settingsAtom = atom(null);