import { getMovies } from "../api/getMovies";
import { searchMovies } from "../api/searchMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ERROR_MESSAGE } from "../constants/error";
import { ResponseError } from "../error/responseError";
import { isLastPage } from "../utils/isLastPage";

export async function morePopularController(
  state: AppStateType,
  movieListView: MovieListViewType,
  addButtonView: AddButtonViewType,
) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMoviesData: movieResponse = await getMovies(
      state.getNextPage(),
    );
    if (isLastPage(popularMoviesData)) addButtonView.hide();
    state.increasePage();
    movieListView.render(popularMoviesData.results);
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

export async function moreSearchController(
  state: AppStateType,
  movieListView: MovieListViewType,
  addButtonView: AddButtonViewType,
) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(
      state.getSearchValue(),
      state.getNextPage(),
    );
    if (isLastPage(searchMoviesData)) addButtonView.hide();
    state.increasePage();
    movieListView.render(searchMoviesData.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      addButtonView.hide();
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
