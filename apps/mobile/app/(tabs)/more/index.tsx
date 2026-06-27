import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native"
import { router } from "expo-router"
import { useAuth } from "../../../src/contexts/auth"

const MENU_ITEMS = [
  { name: "Statements", route: "/(tabs)/more/statements", icon: "📄" },
  { name: "Budgets", route: "/(tabs)/more/budgets", icon: "💰" },
  { name: "Reports", route: "/(tabs)/more/reports", icon: "📊" },
  { name: "Settings", route: "/(tabs)/more/settings", icon: "⚙️" },
]

export default function MoreScreen() {
  const { user, logout } = useAuth()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}
    >
      <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 24 }}>
        More
      </Text>

      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#C2C7CC", marginBottom: 24 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#002434" }}>{user?.name}</Text>
          <Text style={{ fontSize: 14, color: "#72787C", marginTop: 2 }}>{user?.email}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#C2C7CC", marginBottom: 24 }}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => router.push(item.route as any)}
            style={{
              flexDirection: "row", alignItems: "center", padding: 16,
              borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
              borderBottomColor: "#C2C7CC",
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</Text>
            <Text style={{ fontSize: 16, color: "#002434" }}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
          alignItems: "center", borderWidth: 1, borderColor: "#DC2626",
        }}
      >
        <Text style={{ color: "#DC2626", fontSize: 14, fontWeight: "600" }}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
