import { View, Text, ScrollView, RefreshControl, Platform } from "react-native"
import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../src/lib/api"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export default function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: () => api.reports.get(),
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  function formatCompact(amount: number): string {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`
    }
    return `${Math.round(amount).toLocaleString("en-US")}`
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
        Reports
      </Text>

      <View style={{ backgroundColor: "#002434", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <Text style={{ fontSize: 12, color: "#C2C7CC", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
          Available Balance
        </Text>
        <Text style={{ fontSize: 36, fontWeight: "600", color: "#FFFFFF" }}>
          ${formatCompact(data?.bigNumber ?? 0)}
        </Text>
        <Text style={{ fontSize: 14, color: "#C2C7CC", marginTop: 4 }}>
          of {formatCurrency(data?.totalLimit ?? 0)} limit
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 11, color: "#72787C", textTransform: "uppercase", letterSpacing: 1.2 }}>Cards</Text>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#002434" }}>{data?.cardCount ?? 0}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#C2C7CC" }}>
          <Text style={{ fontSize: 11, color: "#72787C", textTransform: "uppercase", letterSpacing: 1.2 }}>Spending</Text>
          <Text style={{ fontSize: 24, fontWeight: "600", color: "#002434" }}>
            {formatCurrency(data?.totalSpending ?? 0)}
          </Text>
        </View>
      </View>

      {data?.monthlyTrend && data.monthlyTrend.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
            Monthly Trend
          </Text>
          {data.monthlyTrend.map((m) => {
            const maxAmount = Math.max(...data.monthlyTrend.map((x) => Math.max(x.spending, x.payments)), 1)
            return (
              <View key={`${m.year}-${m.monthIndex}`} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: "#72787C", marginBottom: 4 }}>
                  {m.month} {m.year}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ flex: 1, height: 20, backgroundColor: "#C2C7CC", borderRadius: 4, overflow: "hidden" }}>
                    <View style={{ width: `${(m.spending / maxAmount) * 100}%`, height: 20, backgroundColor: "#002434", borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: "500", color: "#002434", width: 60, textAlign: "right" }}>
                    {formatCompact(m.spending)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      )}

      {data?.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#002434", marginBottom: 12 }}>
            Category Breakdown
          </Text>
          {data.categoryBreakdown.map((cat) => (
            <View
              key={cat.category}
              style={{
                backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
                marginBottom: 8, borderWidth: 1, borderColor: "#C2C7CC",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: "#002434" }}>{cat.category}</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#002434" }}>
                  {formatCurrency(cat.amount)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ flex: 1, height: 6, backgroundColor: "#C2C7CC", borderRadius: 3 }}>
                  <View style={{ width: `${cat.percentage}%`, height: 6, backgroundColor: "#002434", borderRadius: 3 }} />
                </View>
                <Text style={{ fontSize: 12, color: "#72787C", width: 36, textAlign: "right" }}>
                  {cat.percentage}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
