import { getMovies } from "../api/getMovies";
import { movieListRender } from "../view/movieListRender";
import { searchMovies } from "../api/searchMovies";
import {
  skeletonListRemover,
  skeletonListRender,
} from "../view/skeletonListRender";

export async function getMorePopular(page: number) {
  skeletonListRender(20);
  const popularMoviesData: movieResponse | undefined = await getMovies(page);
  if (popularMoviesData === undefined) return;
  skeletonListRemover();
  movieListRender(popularMoviesData.results);

  return popularMoviesData;
}

export async function getMoreSearch(page: number, searchValue: string) {
  skeletonListRender(20);
  const searchMoviesData = await searchMovies(searchValue, page);
  if (searchMoviesData === undefined) return;
  skeletonListRemover();
  movieListRender(searchMoviesData.results);

  return searchMoviesData;
}

export function comparePage(moviesData: movieResponse | undefined): boolean {
  if (moviesData === undefined) return false;
  return moviesData.page === moviesData.total_pages;
}
