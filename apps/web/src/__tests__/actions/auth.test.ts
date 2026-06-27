import { describe, it, expect, vi, beforeEach } from "vitest"

import { loginAction, registerAction } from "../../actions/auth"
import { signIn } from "../../lib/auth"
import { prisma } from "@creditview/database"

vi.mock("@/lib/dal", () => ({ verifySession: vi.fn().mockResolvedValue({ id: "user-1", email: "test@test.com", name: "Test" }) }))
vi.mock("@/lib/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }))
vi.mock("@/lib/audit", () => ({ logAuditEvent: vi.fn() }))
vi.mock("@creditview/database", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))
vi.mock("bcryptjs", () => ({ default: { hash: vi.fn().mockResolvedValue("hashed-password") } }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns error for invalid email", async () => {
    const formData = new FormData()
    formData.set("email", "not-email")
    formData.set("password", "12345678")

    const result = await loginAction({ success: false, error: "" }, formData)
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it("returns error for short password", async () => {
    const formData = new FormData()
    formData.set("email", "test@test.com")
    formData.set("password", "1234567")

    const result = await loginAction({ success: false, error: "" }, formData)
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns error for mismatched passwords", async () => {
    const formData = new FormData()
    formData.set("name", "John")
    formData.set("email", "john@test.com")
    formData.set("password", "12345678")
    formData.set("confirmPassword", "87654321")

    const result = await registerAction({ success: false, error: "" }, formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Passwords do not match")
  })

  it("returns error if email already registered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "existing-id",
      email: "john@test.com",
      password: "hash",
      name: "John",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const formData = new FormData()
    formData.set("name", "John")
    formData.set("email", "john@test.com")
    formData.set("password", "12345678")
    formData.set("confirmPassword", "12345678")

    const result = await registerAction({ success: false, error: "" }, formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Email already registered")
  })

  it("registers a new user and calls signIn", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: "new-id",
      email: "john@test.com",
      password: "hashed-password",
      name: "John",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    vi.mocked(signIn).mockResolvedValueOnce(undefined as never)

    const formData = new FormData()
    formData.set("name", "John")
    formData.set("email", "john@test.com")
    formData.set("password", "12345678")
    formData.set("confirmPassword", "12345678")

    await registerAction({ success: false, error: "" }, formData)
    expect(prisma.user.create).toHaveBeenCalled()
    expect(signIn).toHaveBeenCalled()
  })
})
