// lib/userService.ts
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export interface UserData {
  uid: string;
  email?: string;
  walletAddress?: string;
  isArtist: boolean;
  name?: string;
  profilePicture?: string;
  stageName?: string;
  createdAt: number;
  updatedAt: number;
}

export async function getUserByEmail(email: string): Promise<UserData | null> {
    if (!email || typeof email !== "string" || !email.trim()) {
        console.warn("getUserByEmail called with invalid email:", email);
        return null;
      }
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as UserData;
}

export async function getUserByWalletAddress(walletAddress: string): Promise<UserData | null> {
  if (!walletAddress) return null;
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("walletAddress", "==", walletAddress));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as UserData;
}

export async function getUserById(uid: string): Promise<UserData | null> {
  if (!uid) return null;
  
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return null;
  
  return userDoc.data() as UserData;
}

function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as Partial<T>;
  }

  export async function createUser(userData: Partial<UserData> & { uid: string }): Promise<UserData> {
    const now = Date.now();
  
    const newUser: UserData = {
      uid: userData.uid,
      email: userData.email || "",
      walletAddress: userData.walletAddress || "",
      isArtist: userData.isArtist || false,
      name: userData.name || "",
      profilePicture: userData.profilePicture,
      stageName: userData.stageName,
      createdAt: now,
      updatedAt: now,
    };
  
    const cleanUser = removeUndefinedFields(newUser);
  
    const userRef = doc(db, "users", userData.uid);
    await setDoc(userRef, cleanUser);
  
    return cleanUser as UserData;
  }

export async function updateUser(uid: string, userData: Partial<UserData>): Promise<UserData> {
  if (!uid) throw new Error("User ID is required for update");
  
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error("User does not exist");
  }
  
  const updatedData = {
    ...userData,
    updatedAt: Date.now(),
  };
  
  await updateDoc(userRef, updatedData);
  
  const updatedUserDoc = await getDoc(userRef);
  return updatedUserDoc.data() as UserData;
}