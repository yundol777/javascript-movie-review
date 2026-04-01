import { getMovies } from "../getMovies";
import { movieBanner } from "../movieBanner";
import { movieListRender } from "../movieListRender";
import { errorListRender } from "../view/errorListRender";

export async function popularController(page: number) {
  const popularMovies: movieResponse | undefined = await getMovies(page);
  if (popularMovies === undefined) {
    console.log("1");
    errorListRender();
    return;
  }
  movieBanner(popularMovies.results[0]);
  movieListRender(popularMovies.results);
}
