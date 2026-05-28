import { atom } from "jotai";

// 1. Define the interface based on your login response
export interface UserSession {
  accessToken?: string;
  user?: any;
  lastVerified?: number;
  lang?: string;
  [key: string]: any;
}

// 2. Create a simple in-memory atom
export const userSessionAtom = atom<UserSession | null>(null);

// Your existing atom
export const scrollDirectionAtom = atom<"up" | "down">("up");


export const settingsAtom = atom(null);