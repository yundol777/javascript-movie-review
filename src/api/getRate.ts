export async function getRate(movieId: string): Promise<string | null> {
  const rate = localStorage.getItem(movieId);
  return rate;
}
