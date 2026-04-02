export function comparePage(moviesData: movieResponse | undefined): boolean {
  if (moviesData === undefined) return false;
  return moviesData.page === moviesData.total_pages;
}
