import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../src/lib/api"

export default function TransactionsScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, search],
    queryFn: () => api.transactions.list({ page, pageSize: 20, search: search || undefined }),
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 16 }}>
        Transactions
      </Text>

      <View style={{
        backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 16,
        borderWidth: 1, borderColor: "#C2C7CC", marginBottom: 16,
      }}>
        <TextInput
          value={search}
          onChangeText={(t) => { setSearch(t); setPage(1) }}
          placeholder="Search transactions..."
          placeholderTextColor="#C2C7CC"
          style={{ paddingVertical: 12, fontSize: 14, color: "#002434" }}
        />
      </View>

      {isLoading ? (
        <Text style={{ color: "#72787C", textAlign: "center", paddingVertical: 32 }}>Loading...</Text>
      ) : !data || data.transactions.length === 0 ? (
        <Text style={{ color: "#72787C", textAlign: "center", paddingVertical: 32 }}>No transactions found</Text>
      ) : (
        data.transactions.map((tx) => (
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                <Text style={{ fontSize: 12, color: "#72787C" }}>{tx.cardName}</Text>
                <Text style={{ fontSize: 11, color: "#C2C7CC" }}>{tx.category}</Text>
              </View>
              <Text style={{ fontSize: 12, color: "#72787C" }}>
                {formatDate(tx.date)}
              </Text>
            </View>
          </View>
        ))
      )}

      {data && data.totalPages > 1 && (
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 12, paddingVertical: 16 }}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: 12, opacity: page === 1 ? 0.4 : 1 }}
          >
            <Text style={{ color: "#002434", fontSize: 14 }}>← Prev</Text>
          </TouchableOpacity>
          <Text style={{ color: "#72787C", fontSize: 14, alignSelf: "center" }}>
            {page} of {data.totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            style={{ padding: 12, opacity: page === data.totalPages ? 0.4 : 1 }}
          >
            <Text style={{ color: "#002434", fontSize: 14 }}>Next →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}
