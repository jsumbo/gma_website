import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { app } from "./firebase"

export const auth = getAuth(app)

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logOut() {
  return signOut(auth)
}

// Admin accounts are created in the Firebase console, and Firestore rules only let users listed
// in the `admins` collection write, so "signed in" is enough for the UI to show the admin panel.
export function useAdminUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      }),
    []
  )

  return { user, loading }
}
