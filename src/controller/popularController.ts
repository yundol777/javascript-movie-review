import { getMovies } from "../getMovies";
import { movieBanner } from "../movieBanner";
import { movieListRender } from "../movieListRender";

export async function popularController(page: number) {
  const popularMovies: movieResponse | undefined = await getMovies(page);
  if (popularMovies === undefined) return;
  movieBanner(popularMovies.results[0]);
  movieListRender(popularMovies.results);
}
