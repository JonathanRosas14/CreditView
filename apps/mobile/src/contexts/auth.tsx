import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, getToken, setToken, removeToken } from "../lib/api"

type User = { id: string; email: string; name: string }

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        api.auth.me()
          .then(setUser)
          .catch(() => removeToken())
          .finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password })
    await setToken(res.token)
    setUser(res.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await api.auth.register({ name, email, password })
    await setToken(res.token)
    setUser(res.user)
  }

  const logout = async () => {
    await removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
