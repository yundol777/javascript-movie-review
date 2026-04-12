import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ERROR_MESSAGE } from "../constants/error";
import { ResponseError } from "../error/responseError";
import { isLastPage } from "../utils/isLastPage";

export async function searchController(
  state: AppStateType,
  movieListView: MovieListViewType,
  infiniteScrollView: InfiniteScrollViewType,
) {
  try {
    movieListView.reset();
    infiniteScrollView.start();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesResult: movieResponse = await searchMovies(
      state.getSearchValue(),
      state.getPage(),
    );
    if (searchMoviesResult.total_results === 0) {
      movieListView.emptyRender();
      infiniteScrollView.stop();
      return;
    }
    if (isLastPage(searchMoviesResult)) {
      infiniteScrollView.stop();
    }
    movieListView.render(searchMoviesResult.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        infiniteScrollView.stop();
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        infiniteScrollView.stop();
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      infiniteScrollView.stop();
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
