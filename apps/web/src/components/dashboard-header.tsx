export function DashboardHeader() {
  return (
    <header
      className="fixed left-64 right-0 top-0 z-20 flex h-16 items-center px-16"
      style={{
        backgroundColor: "rgba(252, 249, 248, 0.8)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderBottom: "1px solid #C2C7CC",
      }}
    >
      <div
        className="flex items-center"
        style={{
          maxWidth: "448px",
          width: "100%",
          backgroundColor: "#F6F3F2",
          borderRadius: "9999px",
          paddingLeft: "40px",
          paddingRight: "16px",
          paddingTop: "10px",
          paddingBottom: "10.6px",
          position: "relative",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="6.5" cy="6.5" r="4.5" stroke="#6B7280" strokeWidth="1.2" />
          <line x1="10" y1="10" x2="13.5" y2="13.5" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search insights\u2026"
          className="w-full border-none bg-transparent text-base outline-none"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "#002434",
            lineHeight: "normal",
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div style={{ position: "relative" }}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 0.5C4.85786 0.5 1.5 3.85786 1.5 8V11.5858L0.292893 12.7929C0.105357 12.9804 0 13.2348 0 13.5V14.5C0 15.0523 0.447715 15.5 1 15.5H17C17.5523 15.5 18 15.0523 18 14.5V13.5C18 13.2348 17.8946 12.9804 17.7071 12.7929L16.5 11.5858V8C16.5 3.85786 13.1421 0.5 9 0.5Z"
              stroke="#42474B"
              strokeWidth="1.2"
            />
            <path d="M6.5 15.5C6.5 16.8807 7.61929 18 9 18C10.3807 18 11.5 16.8807 11.5 15.5" stroke="#42474B" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#BA1A1A",
              border: "2px solid #FCF9F8",
            }}
          />
        </div>

        <div style={{ width: "1px", height: "32px", backgroundColor: "#C2C7CC" }} />

        <span
          className="text-base"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", lineHeight: "25.6px", fontWeight: 400 }}
        >
          ACCOUNT CENTER
        </span>

        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "9999px",
            backgroundColor: "#C2C7CC",
            overflow: "hidden",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="12" r="4" fill="#72787C" />
            <ellipse cx="16" cy="26" rx="8" ry="6" fill="#72787C" />
          </svg>
        </div>
      </div>
    </header>
  )
}
