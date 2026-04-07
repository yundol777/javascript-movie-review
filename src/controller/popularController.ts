import { getMovies } from "../api/getMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ERROR_MESSAGE } from "../constants/error";
import { ResponseError } from "../error/responseError";

export async function popularController(
  page: number,
  movieListView: MovieListViewType,
  movieBannerView: MovieBannerViewType,
  addButtonView: AddButtonViewType,
) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMovies: movieResponse = await getMovies(page);
    if (popularMovies.results.length === 0) {
      movieListView.emptyRender();
      addButtonView.hide();
      return;
    }
    movieBannerView.render(popularMovies.results[0]);
    movieListView.render(popularMovies.results);
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
