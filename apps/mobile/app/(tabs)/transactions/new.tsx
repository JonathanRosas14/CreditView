import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../src/lib/api"

const TYPES = ["PURCHASE", "PAYMENT", "ADVANCE"] as const

export default function NewTransactionScreen() {
  const { cardId: presetCardId } = useLocalSearchParams<{ cardId?: string }>()
  const queryClient = useQueryClient()
  const [cardId, setCardId] = useState(presetCardId ?? "")
  const [type, setType] = useState<"PURCHASE" | "PAYMENT" | "ADVANCE">("PURCHASE")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof api.transactions.create>[0]) => api.transactions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["card", cardId] })
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      Alert.alert("Success", "Transaction created")
      router.back()
    },
    onError: (e: Error) => Alert.alert("Error", e.message),
  })

  function handleSubmit() {
    const amt = parseFloat(amount)
    if (!cardId || isNaN(amt) || !description || !date) {
      Alert.alert("Error", "Please fill all fields correctly")
      return
    }
    mutation.mutate({ cardId, type, amount: amt, description, date })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FCF9F8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "ios" ? 60 : 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Text style={{ color: "#72787C", fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", fontSize: 32, color: "#002434", marginBottom: 24 }}>
          New Transaction
        </Text>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Card ID</Text>
        <TextInput value={cardId} onChangeText={setCardId} placeholder="Card ID" placeholderTextColor="#C2C7CC"
          editable={!presetCardId} style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Type</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              style={{
                flex: 1, padding: 12, borderRadius: 8, alignItems: "center",
                backgroundColor: type === t ? "#002434" : "#FFFFFF",
                borderWidth: 1, borderColor: type === t ? "#002434" : "#C2C7CC",
              }}
            >
              <Text style={{
                fontSize: 11, fontWeight: "600", textTransform: "uppercase",
                color: type === t ? "#FFFFFF" : "#72787C",
              }}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Amount</Text>
        <TextInput value={amount} onChangeText={setAmount} placeholder="0.00" placeholderTextColor="#C2C7CC"
          keyboardType="decimal-pad" style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="What was this for?" placeholderTextColor="#C2C7CC"
          style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Date</Text>
        <TextInput value={date} onChangeText={setDate} placeholder="2025-06-25" placeholderTextColor="#C2C7CC"
          style={inputStyle} />

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isPending}
          style={{
            backgroundColor: "#002434", borderRadius: 12, padding: 16,
            alignItems: "center", marginTop: 24,
          }}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Create Transaction
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
