import { searchMovies } from "../api/searchMovies";
import { movieListRender } from "../view/movieListRender";
import { resetListRender } from "../view/resetListRender";
import { emptyListRender } from "../view/emptyListRender";
import { errorListRender } from "../view/errorListRender";
import { controlMoreButton } from "../view/moreButtonView";
import {
  skeletonListRemover,
  skeletonListRender,
} from "../view/skeletonListRender";

export async function searchController(page: number, searchValue: string) {
  resetListRender();
  skeletonListRender(20);
  const searchMoviesResult: movieResponse | undefined = await searchMovies(
    searchValue,
    page,
  );

  if (searchMoviesResult === undefined) {
    skeletonListRemover();
    errorListRender();
    return;
  }
  if (searchMoviesResult.total_results === 0) {
    skeletonListRemover();
    emptyListRender();
    return;
  }
  if (searchMoviesResult.page === searchMoviesResult.total_pages) {
    controlMoreButton.hide();
  }

  skeletonListRemover();
  movieListRender(searchMoviesResult.results);
}
