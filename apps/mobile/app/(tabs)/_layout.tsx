import { Tabs } from "expo-router"
import { View, Text, Platform } from "react-native"

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: "📊",
    Cards: "💳",
    Transactions: "💸",
    More: "⚙️",
  }
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>{icons[name] ?? "•"}</Text>
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#002434",
        tabBarInactiveTintColor: "#72787C",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#C2C7CC",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => <TabIcon name="Dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ focused }) => <TabIcon name="Cards" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => <TabIcon name="Transactions" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => <TabIcon name="More" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
