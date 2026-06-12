import { test, expect } from "@playwright/test"

test("shows register page", async ({ page }) => {
  await page.goto("/register")
  await expect(page.getByRole("heading", { name: "CreditView" })).toBeVisible()
  await expect(page.getByText("Create your account")).toBeVisible()
})

test("shows error for mismatched passwords", async ({ page }) => {
  await page.goto("/register")
  await page.fill("input[name=name]", "Test User")
  await page.fill("input[name=email]", "test@test.com")
  await page.fill("input[name=password]", "123456")
  await page.fill("input[name=confirmPassword]", "654321")
  await page.click("button[type=submit]")
  await expect(page.getByText("Passwords do not match")).toBeVisible()
})

test("has link to login page", async ({ page }) => {
  await page.goto("/register")
  await expect(page.getByText("Sign in")).toBeVisible()
})
