import { Card } from "../entities/card"

export interface CardRepository {
  findById(id: string): Promise<Card | null>
  findByUserId(userId: string): Promise<Card[]>
  save(card: Card): Promise<void>
  delete(id: string): Promise<void>
}
