"use client"

interface StatCardProps {
  icon: string
  label: string
  value: string
  sublabel?: string
  variant?: "default" | "warning" | "success"
}

const variantStyles = {
  default: { accent: "#904d00", bg: "#fff8f5", valueBg: "#fff1ea" },
  warning: { accent: "#c2571a", bg: "#fff8f5", valueBg: "#fff1ea" },
  success: { accent: "#2e7d32", bg: "#f0f7f1", valueBg: "#e8f5e9" },
}

export default function StatCard({ icon, label, value, sublabel, variant = "default" }: StatCardProps) {
  const s = variantStyles[variant]

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-[20px] transition-shadow duration-200"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(144,77,0,0.07)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(144,77,0,0.12)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(144,77,0,0.07)" }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center text-2xl rounded-[12px]"
        style={{ width: 44, height: 44, backgroundColor: s.valueBg }}
      >
        {icon}
      </div>

      {/* Value */}
      <div>
        <p className="text-[28px] font-700 leading-none mb-1" style={{ color: s.accent }}>
          {value}
        </p>
        <p className="text-[13px] font-500 text-[#7c4a2d]">{label}</p>
        {sublabel && (
          <p className="text-[12px] text-[#a87b5e] mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
