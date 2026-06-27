import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native"
import { useAuth } from "../../../src/contexts/auth"

export default function SettingsScreen() {
  const { user, logout } = useAuth()

  function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ])
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}
    >
      <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 24 }}>
        Settings
      </Text>

      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#C2C7CC", marginBottom: 24 }}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 14, color: "#72787C", marginBottom: 4 }}>Email</Text>
          <Text style={{ fontSize: 16, color: "#002434", fontWeight: "500" }}>{user?.email}</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 14, color: "#72787C", marginBottom: 4 }}>Name</Text>
          <Text style={{ fontSize: 16, color: "#002434", fontWeight: "500" }}>{user?.name}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#002434", borderRadius: 12, padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
