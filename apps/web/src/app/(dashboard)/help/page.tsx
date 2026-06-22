import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = { title: "Help & User Manual" }

const sections = [
  { id: "getting-started", title: "Getting Started" },
  { id: "dashboard", title: "Dashboard" },
  { id: "cards", title: "Cards" },
  { id: "transactions", title: "Transactions" },
  { id: "statements", title: "Statements" },
  { id: "budgets", title: "Budgets" },
  { id: "reports", title: "Reports" },
  { id: "settings", title: "Settings" },
] as const

const h2style: React.CSSProperties = {
  fontFamily: "var(--font-literata)",
  fontWeight: 400,
  fontSize: 24,
  lineHeight: "32px",
  color: "#002434",
}

const h3style: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 500,
  fontSize: 18,
  lineHeight: "27px",
  color: "#002434",
  marginTop: 24,
}

const pstyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: "24px",
  color: "#42474B",
  marginTop: 8,
}

const listStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: "24px",
  color: "#42474B",
  marginTop: 8,
  paddingLeft: 24,
}

const codeStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, 'Liberation Mono', monospace",
  fontSize: 13,
  backgroundColor: "#F0EDED",
  padding: "2px 8px",
  borderRadius: 4,
  color: "#002434",
}

export default function HelpPage() {
  return (
    <div className="space-y-12">
      <section>
        <Breadcrumb pages="Help" />
        <h1
          className="mt-2 text-[32px]"
          style={{
            fontFamily: "var(--font-literata)",
            fontWeight: 400,
            color: "#002434",
            lineHeight: "48px",
          }}
        >
          User Manual
        </h1>
        <p
          className="mt-2 max-w-[640px] text-base"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "#42474B",
            lineHeight: "25.6px",
          }}
        >
          Learn how to navigate CreditView, manage your credit cards, track transactions,
          set budgets, and get the most out of your financial dashboard.
        </p>
      </section>

      {/* Table of Contents */}
      <section
        className="rounded-xl border bg-white p-8"
        style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
      >
        <h2 style={h2style}>Table of Contents</h2>
        <ol className="mt-4 space-y-2" style={{ paddingLeft: 20 }}>
          {sections.map((s) => (
            <li key={s.id} style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, lineHeight: "24px" }}>
              <a href={`#${s.id}`} className="no-underline hover:underline" style={{ color: "#002434" }}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* 1. Getting Started */}
      <section id="getting-started">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>1. Getting Started</h2>

          <h3 style={h3style}>Creating an Account</h3>
          <p style={pstyle}>
            Navigate to the <strong style={{ color: "#002434" }}>Register</strong> page and fill in your full name,
            email address, and a strong password (at least 8 characters with a number). Accept the Terms of Service
            and click <strong style={{ color: "#002434" }}>CREATE ACCOUNT</strong>. You will be logged in automatically.
          </p>

          <h3 style={h3style}>Signing In</h3>
          <p style={pstyle}>
            Go to the <strong style={{ color: "#002434" }}>Login</strong> page, enter your email and password,
            and click <strong style={{ color: "#002434" }}>SIGN IN</strong>. If you forget your password,
            click <strong style={{ color: "#002434" }}>Forgot password?</strong> to receive a reset link.
          </p>

          <h3 style={h3style}>Navigation</h3>
          <p style={pstyle}>
            After logging in, you will see the dashboard sidebar on the left with links to all main sections:
            Dashboard, Cards, Transactions, Statements, Budgets, Reports, and Settings.
            On mobile, tap the hamburger menu icon at the top-left to open the sidebar.
          </p>
        </div>
      </section>

      {/* 2. Dashboard */}
      <section id="dashboard">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>2. Dashboard</h2>
          <p style={pstyle}>
            The Dashboard gives you a high-level snapshot of your finances at a glance.
          </p>

          <h3 style={h3style}>Metric Cards</h3>
          <p style={pstyle}>
            Three cards at the top show your <strong style={{ color: "#002434" }}>Total Limit</strong> (combined credit across all cards),
            <strong style={{ color: "#002434" }}>Total Used</strong> (current balance), and
            <strong style={{ color: "#002434" }}>Available Balance</strong> (remaining credit).
          </p>

          <h3 style={h3style}>Alerts</h3>
          <p style={pstyle}>
            Important notifications (e.g., approaching credit limit, unusual spending)
            appear in a banner below the metrics. Dismiss them by clicking the close button.
          </p>

          <h3 style={h3style}>Recent Transactions</h3>
          <p style={pstyle}>
            The left panel shows your 8 most recent transactions with date, merchant name,
            card used, and amount. Click <strong style={{ color: "#002434" }}>VIEW ALL</strong> to see the full transaction list.
          </p>

          <h3 style={h3style}>Spending Breakdown</h3>
          <p style={pstyle}>
            The right panel displays your top spending categories with progress bars.
            Categories are auto-detected from merchant descriptions.
          </p>
        </div>
      </section>

      {/* 3. Cards */}
      <section id="cards">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>3. Cards</h2>

          <h3 style={h3style}>Viewing Your Cards</h3>
          <p style={pstyle}>
            The Cards page shows all your credit cards in a grid. Each card displays
            the bank name, card name, currency, credit limit, and a utilization bar.
            Click on any card visual to see its details.
          </p>

          <h3 style={h3style}>Adding a New Card</h3>
          <ol style={listStyle}>
            <li>Click <strong style={{ color: "#002434" }}>ADD NEW CARD</strong> at the top-right.</li>
            <li>Fill in the card name, bank, total limit, currency, cutoff day, payment day, and interest rate.</li>
            <li>Click <strong style={{ color: "#002434" }}>SAVE CARD</strong>.</li>
          </ol>

          <h3 style={h3style}>Editing or Deleting a Card</h3>
          <p style={pstyle}>
            On the Cards page, each card has <strong style={{ color: "#002434" }}>EDIT</strong> and
            <strong style={{ color: "#002434" }}>DELETE</strong> links. Editing lets you update all card fields.
            Deleting permanently removes the card and all its transactions.
          </p>

          <h3 style={h3style}>Card Details</h3>
          <p style={pstyle}>
            The Card Detail page shows your card balance, total limit, available credit,
            a visual representation of the card, transaction history, and a form to
            add new transactions to that specific card.
          </p>
        </div>
      </section>

      {/* 4. Transactions */}
      <section id="transactions">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>4. Transactions</h2>

          <h3 style={h3style}>Viewing Transactions</h3>
          <p style={pstyle}>
            The Transactions page lists all your transactions in a table with columns:
            Date, Merchant, Card, Type, Amount, and Status.
            Use the pagination at the bottom to navigate between pages.
          </p>

          <h3 style={h3style}>Filtering</h3>
          <p style={pstyle}>
            Three filters help you find specific transactions:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: "#002434" }}>SELECT CARD</strong> — filter by a specific credit card.</li>
            <li><strong style={{ color: "#002434" }}>DATE RANGE</strong> — choose a from/to date range.</li>
            <li><strong style={{ color: "#002434" }}>Search box</strong> — type a merchant name or transaction type.</li>
          </ul>

          <h3 style={h3style}>Adding a Transaction</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>ADD TRANSACTION</strong> to go to the Cards page, then
            click on a card and use the <strong style={{ color: "#002434" }}>Add Transaction</strong> form
            on the Card Detail page. You can link a transaction to a budget from the dropdown.
          </p>

          <h3 style={h3style}>Exporting Transactions</h3>
          <p style={pstyle}>
            Click the <strong style={{ color: "#002434" }}>Export</strong> button to download the visible
            transactions (filtered by current filters) as a CSV file.
          </p>
        </div>
      </section>

      {/* 5. Statements */}
      <section id="statements">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>5. Statements</h2>

          <h3 style={h3style}>Monthly Statements</h3>
          <p style={pstyle}>
            The Statements page organizes your card activity by month. Each month section
            shows one card per statement with opening balance, closing balance, purchases,
            payments, and credit utilization percentage.
          </p>

          <h3 style={h3style}>Filtering by Card</h3>
          <p style={pstyle}>
            Use the <strong style={{ color: "#002434" }}>FILTER BY CARD</strong> dropdown to view statements
            for a single card.
          </p>

          <h3 style={h3style}>Exporting to CSV</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>EXPORT ALL</strong> to download all visible
            (filtered) statements as a CSV file with card, bank, currency, balances, and transaction counts.
          </p>
        </div>
      </section>

      {/* 6. Budgets */}
      <section id="budgets">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>6. Budgets</h2>

          <h3 style={h3style}>Creating a Budget</h3>
          <ol style={listStyle}>
            <li>Click <strong style={{ color: "#002434" }}>Add Budget</strong> at the top-right of the Budgets page.</li>
            <li>Enter a <strong style={{ color: "#002434" }}>category</strong> name (e.g., Groceries, Entertainment).</li>
            <li>Set the <strong style={{ color: "#002434" }}>amount</strong> you want to allocate.</li>
            <li>Choose a <strong style={{ color: "#002434" }}>period</strong> (Monthly or Yearly).</li>
            <li>Pick a <strong style={{ color: "#002434" }}>start date</strong> and click <strong style={{ color: "#002434" }}>Create Budget</strong>.</li>
          </ol>

          <h3 style={h3style}>Tracking Budgets</h3>
          <p style={pstyle}>
            Each budget card shows the category name, associated card (or &quot;All cards&quot;),
            spent amount vs total budget, and a progress bar. The color changes based on usage:
            green (under 50%), yellow (50-80%), red (over 80%).
          </p>

          <h3 style={h3style}>Linking Transactions to Budgets</h3>
          <p style={pstyle}>
            When adding a transaction on the Card Detail page, use the
            <strong style={{ color: "#002434" }}> Link to Budget</strong> dropdown to associate the
            transaction with a budget. The budget&apos;s spent amount will update automatically.
          </p>

          <h3 style={h3style}>Deleting a Budget</h3>
          <p style={pstyle}>
            Each budget card has a <strong style={{ color: "#002434" }}>DELETE</strong> button at the bottom-right.
            Deleting a budget does not remove linked transactions.
          </p>
        </div>
      </section>

      {/* 7. Reports */}
      <section id="reports">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>7. Reports</h2>

          <h3 style={h3style}>Portfolio Overview</h3>
          <p style={pstyle}>
            The Portfolio Overview section groups your cards by currency and shows the
            available balance, total limit, total used, and utilization percentage for each currency group.
          </p>

          <h3 style={h3style}>Monthly Spending Trend</h3>
          <p style={pstyle}>
            A bar chart displays your spending over the last 6 months, helping you
            identify spending patterns and seasonal changes.
          </p>

          <h3 style={h3style}>Category Breakdown</h3>
          <p style={pstyle}>
            A detailed table breaks down your spending by category (e.g., Groceries, Travel,
            Electronics). Each row shows the category name, total amount, percentage of total
            spending, and number of transactions.
          </p>

          <h3 style={h3style}>Downloading Reports</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>Download Report</strong> at the bottom to save a summary of your financial data.
          </p>
        </div>
      </section>

      {/* 8. Settings */}
      <section id="settings">
        <div
          className="rounded-xl border bg-white p-8"
          style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
        >
          <h2 style={h2style}>8. Settings</h2>

          <h3 style={h3style}>Profile Information</h3>
          <p style={pstyle}>
            The Settings page displays your name and email address. This information
            is shown at the bottom of the sidebar as well.
          </p>

          <h3 style={h3style}>Changing Your Password</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>Change Password</strong> to go to the password reset flow.
            You will receive a reset link via email.
          </p>

          <h3 style={h3style}>Deleting Your Account</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>Delete Account</strong> to permanently remove your
            account and all associated data. This action cannot be undone.
          </p>

          <h3 style={h3style}>Signing Out</h3>
          <p style={pstyle}>
            Click <strong style={{ color: "#002434" }}>SIGN OUT</strong> at the bottom of the sidebar
            to end your session.
          </p>
        </div>
      </section>

      {/* Footer */}
      <p
        className="pt-4 text-center text-sm"
        style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}
      >
        &copy; {new Date().getFullYear()} CreditView. All rights reserved.
      </p>
    </div>
  )
}
