import { getMovies } from "../api/getMovies";
import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";

export async function morePopularController(
  page: number,
  movieListView: MovieListViewType,
) {
  movieListView.skeletonRender(SKELETON_NUMBER);
  const popularMoviesData: movieResponse = await getMovies(page + 1);
  if (popularMoviesData === undefined) return;
  movieListView.skeletonRemover();
  movieListView.render(popularMoviesData.results);
}

export async function moreSearchController(
  page: number,
  searchValue: string,
  movieListView: MovieListViewType,
) {
  movieListView.skeletonRender(SKELETON_NUMBER);
  const searchMoviesData = await searchMovies(searchValue, page + 1);
  if (searchMoviesData === undefined) return;
  movieListView.skeletonRemover();
  movieListView.render(searchMoviesData.results);
}
