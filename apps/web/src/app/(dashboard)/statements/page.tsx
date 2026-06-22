import type { Metadata } from "next"
import { getStatements } from "@/actions/statements"
import { Breadcrumb } from "@/components/breadcrumb"
import { StatementsView } from "@/components/statements-view"

export const metadata: Metadata = { title: "Statements" }

export default async function StatementsPage() {
  const statements = await getStatements()

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <Breadcrumb pages="Statements" />
          <h1
            className="text-[32px]"
            style={{
              fontFamily: "var(--font-literata)",
              fontWeight: 400,
              color: "#002434",
              lineHeight: "40px",
              marginTop: "8px",
            }}
          >
            Statements
          </h1>
          <p
            className="max-w-[420px] text-base"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#5D5F5C",
              lineHeight: "24px",
              fontWeight: 400,
              marginTop: "8px",
            }}
          >
            Access your detailed wealth management reports and monthly performance breakdowns across all premium accounts.
          </p>
        </div>
      </div>

      <StatementsView statements={statements} />
    </div>
  )
}
