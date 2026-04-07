import { getMovies } from "../api/getMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ResponseError } from "../error/responseError";

export async function popularController(
  page: number,
  movieListView: MovieListViewType,
  movieBannerView: MovieBannerViewType,
) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMovies: movieResponse = await getMovies(page);
    if (popularMovies.results.length === 0) {
      movieListView.emptyRender();
      return;
    }
    movieBannerView.render(popularMovies.results[0]);
    movieListView.render(popularMovies.results);
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
