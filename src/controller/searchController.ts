import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ResponseError } from "../error/responseError";

export async function searchController(
  page: number,
  searchValue: string,
  movieListView: MovieListViewType,
  addButtonView: AddButtonViewType,
) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);

    const searchMoviesResult: movieResponse = await searchMovies(
      searchValue,
      page,
    );

    if (searchMoviesResult.total_results === 0) {
      movieListView.emptyRender();
      return;
    }
    if (searchMoviesResult.page === searchMoviesResult.total_pages) {
      addButtonView.hide();
    }

    movieListView.render(searchMoviesResult.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") movieListView.errorRender();
      if (error.type === "NETWORK") movieListView.errorRender();
      movieListView.errorRender();
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
