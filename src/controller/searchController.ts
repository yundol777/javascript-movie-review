import { searchMovies } from "../searchMovies";
import { movieListRender } from "../movieListRender";
import { resetListRender } from "../resetListRender";
import { emptyListRender } from "../view/emptyListRender";
import { errorListRender } from "../view/errorListRender";

export async function searchController(page: number, searchValue: string) {
  const searchMoviesResult: movieResponse | undefined = await searchMovies(
    searchValue,
    page,
  );

  if (searchMoviesResult === undefined) {
    errorListRender();
    return;
  }
  if (searchMoviesResult.results.length === 0) {
    emptyListRender();
    return;
  }

  resetListRender();
  movieListRender(searchMoviesResult.results);
}
