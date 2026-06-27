import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { router, useLocalSearchParams } from "expo-router"
import { api } from "../../../src/lib/api"

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["card", id],
    queryFn: () => api.cards.get(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.cards.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      router.back()
    },
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FCF9F8", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#002434" />
      </View>
    )
  }

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FCF9F8", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#72787C" }}>Card not found</Text>
      </View>
    )
  }

  const { card, transactions } = data
  const utilization = card.totalLimit > 0 ? (card.usedBalance / card.totalLimit) * 100 : 0

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Text style={{ color: "#72787C", fontSize: 14 }}>← Back</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: "#002434", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: "#C2C7CC", marginBottom: 4 }}>{card.bank}</Text>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#FFFFFF", marginBottom: 24 }}>{card.name}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 12, color: "#C2C7CC", marginBottom: 4 }}>Balance</Text>
            <Text style={{ fontSize: 22, fontWeight: "600", color: "#FFFFFF" }}>
              {formatCurrency(card.usedBalance)}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, color: "#C2C7CC", marginBottom: 4 }}>Available</Text>
            <Text style={{ fontSize: 22, fontWeight: "600", color: "#FFFFFF" }}>
              {formatCurrency(card.availableBalance)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 16, height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
          <View style={{ width: `${Math.min(utilization, 100)}%`, height: 6, backgroundColor: "#FCF9F8", borderRadius: 3 }} />
        </View>
        <Text style={{ fontSize: 12, color: "#C2C7CC", marginTop: 8 }}>
          {utilization.toFixed(1)}% utilized of {formatCurrency(card.totalLimit)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 11, color: "#72787C", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Cutoff</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#002434" }}>Day {card.cutoffDay}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 11, color: "#72787C", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Payment</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#002434" }}>Day {card.paymentDay}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 11, color: "#72787C", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Interest</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#002434" }}>{card.interestRate}%</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/transactions/new?cardId=${card.id}`)}
          style={{ flex: 1, backgroundColor: "#002434", borderRadius: 12, padding: 16, alignItems: "center" }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
            + Transaction
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteMutation.mutate()}
          style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, alignItems: "center", borderWidth: 1, borderColor: "#DC2626" }}
        >
          <Text style={{ color: "#DC2626", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
        Transactions
      </Text>

      {(!transactions || transactions.length === 0) ? (
        <Text style={{ color: "#72787C", fontSize: 14, textAlign: "center", paddingVertical: 32 }}>
          No transactions yet
        </Text>
      ) : (
        transactions.map((tx) => (
          <View
            key={tx.id}
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
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{
                  backgroundColor: tx.type === "PAYMENT" ? "#DCFCE7" : tx.type === "ADVANCE" ? "#FEF3C7" : "#DBEAFE",
                  borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
                }}>
                  <Text style={{
                    fontSize: 10, fontWeight: "600",
                    color: tx.type === "PAYMENT" ? "#16A34A" : tx.type === "ADVANCE" ? "#D97706" : "#2563EB",
                  }}>
                    {tx.type}
                  </Text>
                </View>
                {tx.isInstallment && (
                  <Text style={{ fontSize: 11, color: "#72787C" }}>Installments</Text>
                )}
              </View>
              <Text style={{ fontSize: 12, color: "#72787C" }}>
                {formatDate(tx.date)}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}
