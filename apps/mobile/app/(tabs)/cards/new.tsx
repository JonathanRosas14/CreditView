import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { router } from "expo-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../src/lib/api"

export default function NewCardScreen() {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [bank, setBank] = useState("")
  const [totalLimit, setTotalLimit] = useState("")
  const [cutoffDay, setCutoffDay] = useState("")
  const [paymentDay, setPaymentDay] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [currencyCode, setCurrencyCode] = useState("USD")

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof api.cards.create>[0]) => api.cards.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      Alert.alert("Success", "Card created successfully")
      router.back()
    },
    onError: (e: Error) => Alert.alert("Error", e.message),
  })

  function handleSubmit() {
    const limit = parseFloat(totalLimit)
    const cutoff = parseInt(cutoffDay)
    const payment = parseInt(paymentDay)
    const interest = parseFloat(interestRate)

    if (!name || !bank || isNaN(limit) || isNaN(cutoff) || isNaN(payment) || isNaN(interest)) {
      Alert.alert("Error", "Please fill all fields correctly")
      return
    }

    mutation.mutate({
      name, bank, totalLimit: limit,
      cutoffDay: cutoff, paymentDay: payment,
      interestRate: interest, currencyCode,
    })
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
          New Card
        </Text>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Card Name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Travel Rewards" placeholderTextColor="#C2C7CC"
          style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Bank</Text>
        <TextInput value={bank} onChangeText={setBank} placeholder="e.g. Chase" placeholderTextColor="#C2C7CC"
          style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Total Limit</Text>
        <TextInput value={totalLimit} onChangeText={setTotalLimit} placeholder="5000" placeholderTextColor="#C2C7CC"
          keyboardType="numeric" style={inputStyle} />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Cutoff Day</Text>
            <TextInput value={cutoffDay} onChangeText={setCutoffDay} placeholder="15" placeholderTextColor="#C2C7CC"
              keyboardType="number-pad" style={inputStyle} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Payment Day</Text>
            <TextInput value={paymentDay} onChangeText={setPaymentDay} placeholder="5" placeholderTextColor="#C2C7CC"
              keyboardType="number-pad" style={inputStyle} />
          </View>
        </View>

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Interest Rate (%)</Text>
        <TextInput value={interestRate} onChangeText={setInterestRate} placeholder="29.99" placeholderTextColor="#C2C7CC"
          keyboardType="decimal-pad" style={inputStyle} />

        <Text style={{ fontSize: 14, color: "#002434", fontWeight: "600", marginBottom: 6 }}>Currency</Text>
        <TextInput value={currencyCode} onChangeText={setCurrencyCode} placeholder="USD" placeholderTextColor="#C2C7CC"
          autoCapitalize="characters" maxLength={3} style={inputStyle} />

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
              Create Card
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
