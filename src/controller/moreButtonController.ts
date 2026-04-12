import { getMovies } from "../api/getMovies";
import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ERROR_MESSAGE } from "../constants/error";
import { ResponseError } from "../error/responseError";
import { isLastPage } from "../utils/isLastPage";

export async function morePopularController(
  state: AppStateType,
  movieListView: MovieListViewType,
  infiniteScrollView: InfiniteScrollViewType,
) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMoviesData: movieResponse = await getMovies(
      state.getNextPage(),
    );
    if (isLastPage(popularMoviesData)) infiniteScrollView.stop();
    state.increasePage();
    movieListView.render(popularMoviesData.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        infiniteScrollView.stop();
        return;
      }
      if (error.type === "NETWORK") {
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        infiniteScrollView.stop();
        return;
      }
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
      infiniteScrollView.stop();
    }
  } finally {
    movieListView.skeletonRemover();
  }
}

export async function moreSearchController(
  state: AppStateType,
  movieListView: MovieListViewType,
  infiniteScrollView: InfiniteScrollViewType,
) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(
      state.getSearchValue(),
      state.getNextPage(),
    );
    if (isLastPage(searchMoviesData)) infiniteScrollView.stop();
    state.increasePage();
    movieListView.render(searchMoviesData.results);
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
