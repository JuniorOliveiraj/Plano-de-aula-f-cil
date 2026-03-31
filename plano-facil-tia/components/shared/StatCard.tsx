"use client"

interface StatCardProps {
  icon: string
  label: string
  value: string
  sublabel?: string
  variant?: "default" | "warning" | "success"
}

const variantAccent: Record<string, string> = {
  default: "var(--ds-primary)",
  warning: "var(--ds-secondary)",
  success: "var(--ds-ink-success)",
}

export default function StatCard({ icon, label, value, sublabel, variant = "default" }: StatCardProps) {
  const accent = variantAccent[variant]

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-[20px] transition-shadow duration-200"
      style={{
        backgroundColor: "var(--ds-surface-card)",
        boxShadow: "0 4px 20px var(--ds-shadow)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px var(--ds-shadow-lg)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px var(--ds-shadow)" }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center text-2xl rounded-[12px]"
        style={{ width: 44, height: 44, backgroundColor: "var(--ds-surface-low)" }}
      >
        {icon}
      </div>

      {/* Value */}
      <div>
        <p className="text-[28px] font-700 leading-none mb-1" style={{ color: accent }}>
          {value}
        </p>
        <p className="text-[13px] font-500" style={{ color: "var(--ds-terracotta)" }}>{label}</p>
        {sublabel && (
          <p className="text-[12px] mt-0.5" style={{ color: "var(--ds-muted)" }}>{sublabel}</p>
        )}
      </div>
    </div>
  )
}
