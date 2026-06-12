import { test, expect } from "@playwright/test"

test("shows login page", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByRole("heading", { name: "CreditView" })).toBeVisible()
  await expect(page.getByText("Sign in to your account")).toBeVisible()
})

test("shows error for invalid credentials", async ({ page }) => {
  await page.goto("/login")
  await page.fill("input[name=email]", "wrong@test.com")
  await page.fill("input[name=password]", "wrong")
  await page.click("button[type=submit]")
  await expect(page.getByText("Invalid email or password")).toBeVisible({ timeout: 10000 })
})

test("has link to register page", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByText("Create one")).toBeVisible()
})
