import { searchMovies } from "../searchMovies";
import { movieListRender } from "../movieListRender";
import { resetListRender } from "../resetListRender";
import { emptyListRender } from "../view/emptyListRender";

export async function searchController(page: number, searchValue: string) {
  const searchMoviesResult = await searchMovies(searchValue, page);

  if (!searchMoviesResult) return;
  if (searchMoviesResult.results.length === 0) {
    emptyListRender();
    return;
  }

  resetListRender();
  movieListRender(searchMoviesResult.results);
}
