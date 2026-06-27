import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { api } from "../../../src/lib/api"

export default function BudgetsScreen() {
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.budgets.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.budgets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
    onError: (e: Error) => Alert.alert("Error", e.message),
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
          Budgets
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/more/budgets/new")}
          style={{ backgroundColor: "#002434", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      {(!data || data.length === 0) ? (
        <Text style={{ color: "#72787C", textAlign: "center", paddingVertical: 32 }}>No budgets yet</Text>
      ) : (
        data.map((budget) => {
          const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
          const remaining = budget.amount - budget.spent
          return (
            <View
              key={budget.id}
              style={{
                backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
                marginBottom: 8, borderWidth: 1, borderColor: "#C2C7CC",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#002434" }}>{budget.category}</Text>
                  {budget.card && (
                    <Text style={{ fontSize: 12, color: "#72787C" }}>{budget.card.name}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => {
                  Alert.alert("Delete Budget", `Delete ${budget.category} budget?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(budget.id) },
                  ])
                }}>
                  <Text style={{ color: "#DC2626", fontSize: 14 }}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 6, backgroundColor: "#C2C7CC", borderRadius: 3, marginBottom: 8 }}>
                <View style={{
                  width: `${Math.min(percentage, 100)}%`,
                  height: 6,
                  backgroundColor: percentage > 100 ? "#DC2626" : percentage > 80 ? "#D97706" : "#002434",
                  borderRadius: 3,
                }} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: "#72787C" }}>
                  {formatCurrency(budget.spent)} spent
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: remaining < 0 ? "#DC2626" : "#72787C" }}>
                  {remaining < 0 ? `$${Math.abs(remaining).toFixed(2)} over` : `${formatCurrency(remaining)} left`}
                </Text>
              </View>
            </View>
          )
        })
      )}
    </ScrollView>
  )
}
