import { View, Text, ScrollView, RefreshControl, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../src/lib/api"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export default function StatementsScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["statements"],
    queryFn: () => api.statements.list(),
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const groupedByMonth = new Map<string, typeof data>()
  data?.forEach((s) => {
    const key = `${s.year}-${String(s.month).padStart(2, "0")}`
    if (!groupedByMonth.has(key)) groupedByMonth.set(key, [])
    groupedByMonth.get(key)!.push(s)
  })
  const sortedMonths = Array.from(groupedByMonth.entries()).sort().reverse()

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
        Statements
      </Text>

      {sortedMonths.length === 0 ? (
        <Text style={{ color: "#72787C", textAlign: "center", paddingVertical: 32 }}>No statements yet</Text>
      ) : (
        sortedMonths.map(([key, statements]) => {
          const [year, month] = key.split("-")
          return (
            <View key={key} style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
                {MONTHS[parseInt(month) - 1]} {year}
              </Text>
              {statements.map((s) => (
                <View
                  key={`${s.cardId}-${key}`}
                  style={{
                    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
                    marginBottom: 8, borderWidth: 1, borderColor: "#C2C7CC",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#002434" }}>{s.cardName}</Text>
                    <Text style={{ fontSize: 12, color: "#72787C" }}>{s.bank}</Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: "#C2C7CC", borderRadius: 2, marginBottom: 8 }}>
                    <View style={{
                      width: `${Math.min((s.closingBalance / s.totalLimit) * 100, 100)}%`,
                      height: 4, backgroundColor: "#002434", borderRadius: 2,
                    }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                      <Text style={{ fontSize: 11, color: "#72787C" }}>Opening</Text>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: "#002434" }}>
                        {formatCurrency(s.openingBalance)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: "#72787C" }}>Purchases</Text>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: "#002434" }}>
                        {formatCurrency(s.totalPurchases)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 11, color: "#72787C" }}>Closing</Text>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: "#002434" }}>
                        {formatCurrency(s.closingBalance)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )
        })
      )}
    </ScrollView>
  )
}
