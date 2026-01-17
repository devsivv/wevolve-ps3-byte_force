"use client"

interface MatchScoreRingProps {
  score: number
  size?: number
}

export function MatchScoreRing({ score, size = 56 }: MatchScoreRingProps) {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 90) return "stroke-emerald-500"
    if (score >= 75) return "stroke-primary"
    if (score >= 60) return "stroke-amber-500"
    return "stroke-muted-foreground"
  }

  const getGlow = (score: number) => {
    if (score >= 90) return "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
    if (score >= 75) return "drop-shadow-[0_0_8px_var(--neon-glow)]"
    if (score >= 60) return "drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
    return ""
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className={`transform -rotate-90 ${getGlow(score)}`} width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${getColor(score)} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-foreground">{score}%</span>
      </div>
    </div>
  )
}
