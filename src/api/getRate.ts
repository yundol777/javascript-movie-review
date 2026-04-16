export async function getRate(movieId: string): Promise<string> {
  const rate = localStorage.getItem(movieId);
  if (rate === null) return "0";
  return rate;
}
