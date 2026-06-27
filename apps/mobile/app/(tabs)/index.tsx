import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { api } from "../../src/lib/api"

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.dashboard.get(),
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FCF9F8", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#72787C" }}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 24 }}>
        Dashboard
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1, minWidth: "45%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 12, color: "#72787C", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            Balance
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#002434" }}>
            {formatCurrency(data?.totalBalance ?? 0)}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: "45%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 12, color: "#72787C", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            Limit
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#002434" }}>
            {formatCurrency(data?.totalLimit ?? 0)}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: "45%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 12, color: "#72787C", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            Cards
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#002434" }}>
            {data?.totalCards ?? 0}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
        Recent Transactions
      </Text>
      {data?.recentTransactions?.map((tx) => (
        <TouchableOpacity
          key={tx.id}
          onPress={() => router.push(`/(tabs)/cards/${tx.cardId}`)}
          style={{
            backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
            marginBottom: 8, borderWidth: 1, borderColor: "#C2C7CC",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#002434", flex: 1 }}>{tx.description}</Text>
            <Text style={{
              fontSize: 14, fontWeight: "600",
              color: tx.type === "PAYMENT" ? "#16A34A" : "#002434",
            }}>
              {tx.type === "PAYMENT" ? "+" : ""}{formatCurrency(tx.amount)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "#72787C" }}>{tx.cardName}</Text>
            <Text style={{ fontSize: 12, color: "#72787C" }}>
              {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {data?.spendingByCategory && data.spendingByCategory.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
            Spending by Category
          </Text>
          {data.spendingByCategory.map((cat) => (
            <View
              key={cat.category}
              style={{
                flexDirection: "row", justifyContent: "space-between",
                backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
                marginBottom: 8, borderWidth: 1, borderColor: "#C2C7CC",
              }}
            >
              <Text style={{ fontSize: 14, color: "#002434" }}>{cat.category}</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#002434" }}>
                {formatCurrency(cat.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
