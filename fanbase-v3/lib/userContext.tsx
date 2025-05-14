// lib/userContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@account-kit/react";
import { 
  getUserByEmail, 
  getUserByWalletAddress, 
  createUser, 
  updateUser,
  UserData 
} from "./userService";
import { v4 as uuidv4 } from "uuid";

interface UserContextType {
  firebaseUser: UserData | null;
  isLoading: boolean;
  error: Error | null;
  updateUserProfile: (userData: Partial<UserData>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const alchemyUser = useUser();
  const [firebaseUser, setFirebaseUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!alchemyUser) {
        setFirebaseUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        let user: UserData | null = null;
        
        // Try to find user by email if available
        if (typeof alchemyUser.email === "string" && alchemyUser.email.trim().length > 0) {
          console.log("Syncing user with email:", alchemyUser.email);
          user = await getUserByEmail(alchemyUser.email);
        }
        
        // If no user found by email and wallet address exists, try by wallet address
        if (!user && alchemyUser.address) {
          user = await getUserByWalletAddress(alchemyUser.address);
        }
        
        // If user exists, update with any new information
        if (user) {
          // Check if we need to update the user with new information
          const needsUpdate = (
            (alchemyUser.email && user.email !== alchemyUser.email) || 
            (alchemyUser.address && user.walletAddress !== alchemyUser.address)
          );
          
          if (needsUpdate) {
            const updatedUser = await updateUser(user.uid, {
              email: alchemyUser.email || user.email,
              walletAddress: alchemyUser.address || user.walletAddress,
            });
            setFirebaseUser(updatedUser);
          } else {
            setFirebaseUser(user);
          }
        } 
        // If no user found, create a new one
        else {
          const newUser = await createUser({
            uid: uuidv4(), // Generate a unique ID
            email: alchemyUser.email,
            walletAddress: alchemyUser.address,
            isArtist: false, // Default value
            name: alchemyUser.email ? alchemyUser.email.split('@')[0] : undefined, // Simple default name
          });
          setFirebaseUser(newUser);
        }
      } catch (err) {
        console.error("Error syncing user data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [alchemyUser]);

  const updateUserProfile = async (userData: Partial<UserData>) => {
    if (!firebaseUser) {
      throw new Error("No user logged in");
    }

    try {
      const updatedUser = await updateUser(firebaseUser.uid, userData);
      setFirebaseUser(updatedUser);
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  return (
    <UserContext.Provider 
      value={{
        firebaseUser,
        isLoading,
        error,
        updateUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useFirebaseUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useFirebaseUser must be used within a UserProvider");
  }
  return context;
};