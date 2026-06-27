import "../src/global.css"
import { Slot, Stack, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "../src/contexts/auth"
import { ActivityIndicator, View } from "react-native"
import { useEffect } from "react"

const queryClient = new QueryClient()

function RootNavigator() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/(tabs)")
      } else {
        router.replace("/(auth)/login")
      }
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FCF9F8" }}>
        <ActivityIndicator size="large" color="#002434" />
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  )
}
