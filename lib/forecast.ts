export function linearProjectionMonth(totalByDay: Array<{ date: string; amountUsd: number }>) {
  if (totalByDay.length === 0) return 0

  const xs = totalByDay.map((_, i) => i + 1)
  const ys = totalByDay.map((d) => d.amountUsd)
  const n = xs.length

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
  const sumX = sum(xs)
  const sumY = sum(ys)
  const sumXY = sum(xs.map((x, i) => x * ys[i]))
  const sumXX = sum(xs.map((x) => x * x))

  const slope = (n * sumXY - sumX * sumY) / Math.max(1, n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const daysInMonth = 30
  const projected = Array.from({ length: daysInMonth }, (_, i) => intercept + slope * (i + 1)).reduce(
    (a, b) => a + Math.max(0, b),
    0,
  )

  return projected
}
