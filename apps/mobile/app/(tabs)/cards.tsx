import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { api } from "../../src/lib/api"

export default function CardsScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const { data: cards, isLoading, refetch } = useQuery({
    queryKey: ["cards"],
    queryFn: () => api.cards.list(),
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434" }}>
          Cards
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cards/new")}
          style={{ backgroundColor: "#002434", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      {(!cards || cards.length === 0) ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 }}>
          <Text style={{ color: "#72787C", fontSize: 16 }}>No cards yet</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cards/new")}
            style={{ backgroundColor: "#002434", borderRadius: 12, padding: 16, marginTop: 16 }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Add Your First Card
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push(`/(tabs)/cards/${card.id}`)}
            style={{
              backgroundColor: "#002434", borderRadius: 16, padding: 24,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 14, color: "#C2C7CC", marginBottom: 4 }}>{card.bank}</Text>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#FFFFFF", marginBottom: 20 }}>
              {card.name}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: 12, color: "#C2C7CC", marginBottom: 4 }}>Balance</Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFFFF" }}>
                  {formatCurrency(card.usedBalance)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 12, color: "#C2C7CC", marginBottom: 4 }}>Limit</Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFFFF" }}>
                  {formatCurrency(card.totalLimit)}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 16, height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
              <View style={{
                width: `${Math.min((card.usedBalance / card.totalLimit) * 100, 100)}%`,
                height: 4, backgroundColor: "#FCF9F8", borderRadius: 2,
              }} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}
