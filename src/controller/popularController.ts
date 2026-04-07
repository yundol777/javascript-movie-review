import { getMovies } from "../api/getMovies";
import { SKELETON_NUMBER } from "../constants/constant";
import { ResponseError } from "../error/responseError";

export async function popularController(
  page: number,
  MovieListView: MovieListViewType,
  MovieBannerView: MovieBannerViewType,
) {
  try {
    MovieListView.reset();
    MovieListView.skeletonRender(SKELETON_NUMBER);

    const popularMovies: movieResponse = await getMovies(page);

    if (popularMovies.results.length === 0) {
      MovieListView.emptyRender();
      return;
    }

    MovieBannerView.render(popularMovies.results[0]);
    MovieListView.render(popularMovies.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") MovieListView.errorRender();
      if (error.type === "NETWORK") MovieListView.errorRender();

      MovieListView.errorRender();
    }
  } finally {
    MovieListView.skeletonRemover();
  }
}
