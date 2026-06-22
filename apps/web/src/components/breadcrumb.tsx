const chevron = (
  <svg key="chevron" width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 0.5L3.5 3.5L1 6.5" stroke="#72787C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Breadcrumb({ pages }: { pages: string | string[] }) {
  const segments = Array.isArray(pages) ? pages : [pages]

  return (
    <div
      className="flex items-center gap-2 text-[10px] uppercase"
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 400,
        lineHeight: "15px",
        letterSpacing: "1px",
      }}
    >
      <span style={{ color: "#72787C" }}>CREDITVIEW</span>
      {segments.map((page, i) => (
        <span key={page} className="flex items-center gap-2">
          {chevron}
          <span style={{ color: i === segments.length - 1 ? "#002434" : "#72787C" }}>{page}</span>
        </span>
      ))}
    </div>
  )
}
