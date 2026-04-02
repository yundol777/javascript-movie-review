import { getMovies } from "../api/getMovies";
import { movieListRender } from "../view/movieListRender";
import { searchMovies } from "../api/searchMovies";
import {
  skeletonListRemover,
  skeletonListRender,
} from "../view/skeletonListRender";
import { comparePage } from "../utils/comparePage";
import { SKELETON_NUMBER } from "../constants/constant";

async function getNextData(
  stateObject: StateType,
): Promise<movieResponse | undefined> {
  if (stateObject.isSearch) {
    return await moreButtonController.getMoreSearch(
      stateObject.page,
      stateObject.searchValue,
    );
  }

  return await moreButtonController.getMorePopular(stateObject.page);
}

export const moreButtonController = {
  handleLoadMore: async (stateObject: StateType): Promise<boolean> => {
    stateObject.page += 1;
    const nextData = await getNextData(stateObject);
    return comparePage(nextData);
  },

  getMorePopular: async (page: number) => {
    skeletonListRender(SKELETON_NUMBER);
    const popularMoviesData: movieResponse | undefined = await getMovies(page);
    if (popularMoviesData === undefined) return;
    skeletonListRemover();
    movieListRender(popularMoviesData.results);

    return popularMoviesData;
  },

  getMoreSearch: async (page: number, searchValue: string) => {
    skeletonListRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(searchValue, page);
    if (searchMoviesData === undefined) return;
    skeletonListRemover();
    movieListRender(searchMoviesData.results);

    return searchMoviesData;
  },
};
