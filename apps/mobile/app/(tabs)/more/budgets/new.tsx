import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { router } from "expo-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../../src/lib/api"

export default function NewBudgetScreen() {
  const queryClient = useQueryClient()
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [period, setPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof api.budgets.create>[0]) => api.budgets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      Alert.alert("Success", "Budget created")
      router.back()
    },
    onError: (e: Error) => Alert.alert("Error", e.message),
  })

  function handleSubmit() {
    const amt = parseFloat(amount)
    if (!category || isNaN(amt) || !startDate) {
      Alert.alert("Error", "Please fill all fields correctly")
      return
    }
    mutation.mutate({ category, amount: amt, period, startDate })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FCF9F8" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Text style={{ color: "#72787C", fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 24 }}>
          New Budget
        </Text>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Category</Text>
        <TextInput value={category} onChangeText={setCategory} placeholder="e.g. Food" placeholderTextColor="#C2C7CC" style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Amount</Text>
        <TextInput value={amount} onChangeText={setAmount} placeholder="500" placeholderTextColor="#C2C7CC" keyboardType="decimal-pad" style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Period</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          {(["MONTHLY", "YEARLY"] as const).map((p) => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p)}
              style={{
                flex: 1, padding: 12, borderRadius: 8, alignItems: "center",
                backgroundColor: period === p ? "#002434" : "#FFFFFF",
                borderWidth: 1, borderColor: period === p ? "#002434" : "#C2C7CC",
              }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: period === p ? "#FFFFFF" : "#72787C" }}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Start Date</Text>
        <TextInput value={startDate} onChangeText={setStartDate} placeholder="2025-06-25" placeholderTextColor="#C2C7CC" style={inputStyle} />

        <TouchableOpacity onPress={handleSubmit} disabled={mutation.isPending}
          style={{ backgroundColor: "#002434", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 }}>
          {mutation.isPending ? <ActivityIndicator color="#FFFFFF" /> : (
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Create Budget
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const inputStyle = {
  backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C2C7CC",
  borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, color: "#002434",
}
