import { getMovies } from "../api/getMovies";
import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";

export async function morePopularController(
  page: number,
  movieListView: MovieListViewType,
) {
  movieListView.skeletonRender(SKELETON_NUMBER);
  const popularMoviesData: movieResponse = await getMovies(page);
  if (popularMoviesData === undefined) return;
  movieListView.skeletonRemover();
  movieListView.render(popularMoviesData.results);
}

export async function moreSearchController(
  state: AppStateType,
  movieListView: MovieListViewType,
) {
  movieListView.skeletonRender(SKELETON_NUMBER);
  const searchMoviesData = await searchMovies(
    state.getSearchValue(),
    state.getPage(),
  );
  if (searchMoviesData === undefined) return;
  movieListView.skeletonRemover();
  movieListView.render(searchMoviesData.results);
}
