export function createId(length: number = 8): string {
  return Math.random()
    .toString(16)
    .slice(2, 2 + length)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
