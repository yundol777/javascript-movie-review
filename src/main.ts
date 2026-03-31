import { getMovies } from "./getMovies";
import { movieListRender } from "./movieListRender";
import { movieBanner } from "./movieBanner";

addEventListener("load", async () => {
  const app = document.querySelector("#app");

  if (app) {
    const popularMovies: Movies[] | undefined = await getMovies();
    if (popularMovies === undefined) return;
    movieBanner(popularMovies[0]);
    movieListRender(popularMovies);
  }
});
