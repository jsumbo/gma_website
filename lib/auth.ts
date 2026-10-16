import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { app } from "./firebase"

export const auth = getAuth(app)

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logOut() {
  return signOut(auth)
}

// Firestore rules only allow writes from users with a doc at admins/{uid}. Checking for it here lets the
// UI explain a missing/mistyped admin doc up front instead of every save failing with "insufficient permissions".
export function useAdminUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setLoading(true)
        setUser(u)
        let admin = false
        if (u) {
          try {
            admin = (await getDoc(doc(getFirestore(app), "admins", u.uid))).exists()
          } catch {
            admin = false
          }
        }
        setIsAdmin(admin)
        setLoading(false)
      }),
    []
  )

  return { user, isAdmin, loading }
}
