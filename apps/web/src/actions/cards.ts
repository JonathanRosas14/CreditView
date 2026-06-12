"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService } from "@creditview/core"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

export async function createCardAction(_prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  try {
    await cardService.createCard({
      userId: session.user.id,
      name: formData.get("name") as string,
      bank: formData.get("bank") as string,
      totalLimit: Number(formData.get("totalLimit")),
      cutoffDay: Number(formData.get("cutoffDay")),
      paymentDay: Number(formData.get("paymentDay")),
      interestRate: Number(formData.get("interestRate")),
      currencyCode: formData.get("currencyCode") as string,
    })

    revalidatePath("/cards")
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCardAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await cardRepo.delete(id)
  revalidatePath("/cards")
  redirect("/cards")
}
