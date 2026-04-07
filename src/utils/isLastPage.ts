export function isLastPage(moviesData: movieResponse): boolean {
  return moviesData.page === moviesData.total_pages;
}
