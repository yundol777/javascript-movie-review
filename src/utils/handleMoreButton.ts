import { getMovies } from "../getMovies";
import { movieListRender } from "../movieListRender";
import { searchMovies } from "../searchMovies";

export async function getMorePopular(page: number) {
  const popularMoviesData: movieResponse | undefined = await getMovies(page);
  if (popularMoviesData === undefined) return;
  movieListRender(popularMoviesData.results);

  return popularMoviesData;
}

export async function getMoreSearch(page: number, searchValue: string) {
  const searchMoviesData = await searchMovies(searchValue, page);
  if (searchMoviesData === undefined) return;
  movieListRender(searchMoviesData.results);

  return searchMoviesData;
}

export function comparePage(moviesData: movieResponse | undefined): boolean {
  if (moviesData === undefined) return false;
  return moviesData.page === moviesData.total_pages;
}
