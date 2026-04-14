import { atom } from "jotai";
// Import atomWithStorage for local storage persistence
import { atomWithStorage } from "jotai/utils"; 

// 1. Define the interface based on your login response
export interface UserSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role:string;
    // Add other relevant fields...
  };
}

// 2. Create a persisted atom
// "auth-session" is the key used in localStorage. 
// null is the default value when the user is not logged in.
export const userSessionAtom = atomWithStorage<UserSession | null>("auth-session", null);

// Your existing atom
export const scrollDirectionAtom = atom<"up" | "down">("up");


export const settingsAtom = atom(null);