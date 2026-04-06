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
import { SKELETON_NUMBER } from "../constants/constant";
import { ResponseError } from "../error/responseError";

export async function searchController(page: number, searchValue: string) {
  try {
    resetListRender();
    skeletonListRender(SKELETON_NUMBER);
    const searchMoviesResult: movieResponse = await searchMovies(
      searchValue,
      page,
    );

    if (searchMoviesResult.total_results === 0) {
      emptyListRender();
      return;
    }
    if (searchMoviesResult.page === searchMoviesResult.total_pages) {
      controlMoreButton.hide();
    }

    movieListRender(searchMoviesResult.results);
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
