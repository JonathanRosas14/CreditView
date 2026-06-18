export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <div style={{ backgroundColor: "#E5E5E1", height: "32px", width: "200px", borderRadius: "4px" }} />
      <div style={{ backgroundColor: "#E5E5E1", height: "16px", width: "400px", borderRadius: "4px", marginTop: "12px" }} />

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white px-[33px] py-8"
            style={{ borderColor: "#C2C7CC" }}
          >
            <div style={{ backgroundColor: "#E5E5E1", height: "12px", width: "80px", borderRadius: "4px" }} />
            <div style={{ backgroundColor: "#E5E5E1", height: "28px", width: "120px", borderRadius: "4px", marginTop: "16px" }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-6">
          <div style={{ backgroundColor: "#E5E5E1", height: "20px", width: "180px", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "16px", width: "100%", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "16px", width: "100%", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "16px", width: "100%", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "16px", width: "100%", borderRadius: "4px" }} />
        </div>
        <div className="col-span-4 space-y-6">
          <div style={{ backgroundColor: "#E5E5E1", height: "20px", width: "160px", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "12px", width: "100%", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "12px", width: "100%", borderRadius: "4px" }} />
          <div style={{ backgroundColor: "#E5E5E1", height: "12px", width: "100%", borderRadius: "4px" }} />
        </div>
      </div>
    </div>
  )
}
