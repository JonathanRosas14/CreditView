const gradients: [string, string][] = [
  ["#002434", "#1A4A5E"],
  ["#1A3A4A", "#2C4A5B"],
  ["#001E2C", "#002434"],
]

export function CardVisual({ card, index }: { card: { id: string; bank: string; name: string }; index: number }) {
  const [colorA, colorB] = gradients[index % gradients.length]

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        aspectRatio: "1.58",
        borderRadius: "12px",
        background: `linear-gradient(147.67deg, ${colorA} 0%, ${colorB} 100%)`,
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        padding: "24px",
      }}
    >
      {index === 0 && (
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-40px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }}
        />
      )}
      {index === 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-40px",
            width: "192px",
            height: "192px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }}
        />
      )}
      {index === 2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div className="flex items-start justify-between">
        <span
          className="text-[10px] uppercase"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "rgba(255,255,255,0.5)",
            lineHeight: "15px",
            letterSpacing: "2px",
            fontWeight: 400,
          }}
        >
          {card.bank}
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2C7.5 2 5 4.5 5 7.5V10H4V16H16V10H15V7.5C15 4.5 12.5 2 10 2Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <path d="M10 11C10.8284 11 11.5 11.6716 11.5 12.5C11.5 13.3284 10.8284 14 10 14C9.17157 14 8.5 13.3284 8.5 12.5C8.5 11.6716 9.17157 11 10 11Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="mt-6" style={{ position: "relative", zIndex: 1 }}>
        <p
          className="text-2xl"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, 'Liberation Mono', monospace",
            fontSize: "24px",
            lineHeight: "36px",
            letterSpacing: "4.8px",
            color: "#FFFFFF",
            fontWeight: 400,
          }}
        >
          &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; XXXX
        </p>
      </div>
    </div>
  )
}
