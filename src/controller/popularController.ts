import { getMovies } from "../api/getMovies";
import { movieBanner } from "../view/movieBanner";
import { movieListRender } from "../view/movieListRender";
import { errorListRender } from "../view/errorListRender";
import {
  skeletonListRemover,
  skeletonListRender,
} from "../view/skeletonListRender";
import { SKELETON_NUMBER } from "../constants/constant";
import { ResponseError } from "../error/responseError";
import { emptyListRender } from "../view/emptyListRender";

export async function popularController(page: number) {
  try {
    skeletonListRender(SKELETON_NUMBER);

    const popularMovies: movieResponse = await getMovies(page);

    if (popularMovies.results.length === 0) {
      emptyListRender();
      return;
    }

    movieBanner(popularMovies.results[0]);
    movieListRender(popularMovies.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") errorListRender();
      if (error.type === "NETWORK") errorListRender();
      errorListRender();
    }
  } finally {
    skeletonListRemover();
  }
}
