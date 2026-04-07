import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ERROR_MESSAGE } from "../constants/error";
import { ResponseError } from "../error/responseError";
import { isLastPage } from "../utils/isLastPage";

export async function searchController(
  state: AppStateType,
  movieListView: MovieListViewType,
  addButtonView: AddButtonViewType,
) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesResult: movieResponse = await searchMovies(
      state.getSearchValue(),
      state.getPage(),
    );
    if (searchMoviesResult.total_results === 0) {
      movieListView.emptyRender();
      return;
    }
    if (isLastPage(searchMoviesResult)) {
      addButtonView.hide();
    }
    movieListView.render(searchMoviesResult.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
