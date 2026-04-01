import { getMovies } from "../getMovies";
import { movieBanner } from "../movieBanner";
import { movieListRender } from "../view/movieListRender";
import { errorListRender } from "../view/errorListRender";
import {
  skeletonListRemover,
  skeletonListRender,
} from "../view/skeletonListRender";

export async function popularController(page: number) {
  skeletonListRender(20);
  const popularMovies: movieResponse | undefined = await getMovies(page);
  if (popularMovies === undefined) {
    errorListRender();
    return;
  }

  skeletonListRemover();
  movieBanner(popularMovies.results[0]);
  movieListRender(popularMovies.results);
}
