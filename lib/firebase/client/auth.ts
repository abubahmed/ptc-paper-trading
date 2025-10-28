import { auth, db } from "@/lib/firebase/client/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const allowedDomains = ["@princeton.edu"];

export function getAuth() {
  return auth;
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    if (!allowedDomains.some((domain) => result?.user?.email?.endsWith(domain))) {
      await signOut(auth);
      return { error: "You are not authorized to sign in with this email" };
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}