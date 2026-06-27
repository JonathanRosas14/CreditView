import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { router } from "expo-router"
import { useAuth } from "../../src/contexts/auth"

export default function RegisterScreen() {
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!name || !email || !password) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      await register(name, email, password)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 32 }}>
        <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 48, fontWeight: "400", color: "#002434", marginBottom: 8 }}>
          CreditView
        </Text>
        <Text style={{ fontSize: 16, color: "#72787C", marginBottom: 40 }}>
          Create your account
        </Text>

        {error ? (
          <View style={{ backgroundColor: "#FEE2E2", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: "#DC2626", fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#C2C7CC"
          style={{
            backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C2C7CC",
            borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, color: "#002434",
          }}
        />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor="#C2C7CC"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C2C7CC",
            borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, color: "#002434",
          }}
        />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#C2C7CC"
          secureTextEntry
          style={{
            backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C2C7CC",
            borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, color: "#002434",
          }}
        />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          placeholderTextColor="#C2C7CC"
          secureTextEntry
          style={{
            backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C2C7CC",
            borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 32, color: "#002434",
          }}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: "#002434", borderRadius: 12, padding: 16,
            alignItems: "center", marginBottom: 16,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: "center" }}>
          <Text style={{ color: "#72787C", fontSize: 14 }}>
            Already have an account? <Text style={{ color: "#002434", fontWeight: "600" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
