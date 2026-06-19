import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DeleteAccountButton } from "./delete-account-button"

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = session.user

  return (
    <div className="space-y-8">
      <h1
        style={{
          fontFamily: "var(--font-literata)",
          fontWeight: 400,
          fontSize: 32,
          lineHeight: "48px",
          color: "#002434",
        }}
      >
        Settings
      </h1>

      <div className="space-y-6" style={{ maxWidth: 560 }}>
        {/* Profile */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            border: "1px solid #C2C7CC",
            padding: 32,
          }}
          className="space-y-6"
        >
          <h2
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "27px",
              color: "#002434",
            }}
          >
            Profile
          </h2>

          <div className="space-y-4">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 700,
                  fontSize: 10,
                  lineHeight: "12px",
                  letterSpacing: "1px",
                  color: "#72787C",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Name
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#002434",
                }}
              >
                {user.name ?? "—"}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 700,
                  fontSize: 10,
                  lineHeight: "12px",
                  letterSpacing: "1px",
                  color: "#72787C",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#002434",
                }}
              >
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Account */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            border: "1px solid #C2C7CC",
            padding: 32,
          }}
          className="space-y-5"
        >
          <h2
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "27px",
              color: "#002434",
            }}
          >
            Account
          </h2>

          <div className="space-y-4">
            <Link
              href="/forgot-password"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "18px",
                letterSpacing: "1.2px",
                color: "#002434",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Change Password
            </Link>
          </div>

          <div
            style={{
              borderTop: "1px solid #C2C7CC",
              paddingTop: 16,
            }}
          >
            <DeleteAccountButton />
          </div>
        </div>

        {/* Sessions */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            border: "1px solid #C2C7CC",
            padding: 32,
          }}
          className="space-y-4"
        >
          <h2
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "27px",
              color: "#002434",
            }}
          >
            Sessions
          </h2>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "18.2px",
              color: "#72787C",
            }}
          >
            Signed in as {user.email}
          </p>
        </div>
      </div>
    </div>
  )
}
