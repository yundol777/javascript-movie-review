import { getMovies } from "./getMovies";
import { movieListRender } from "./movieListRender";
import { movieBanner } from "./movieBanner";
import { searchMovies } from "./searchMovies";
import { resetListRender } from "./resetListRender";

addEventListener("load", async () => {
  const app = document.querySelector("#app");

  if (app) {
    const popularMovies: Movies[] | undefined = await getMovies();
    if (popularMovies === undefined) return;
    movieBanner(popularMovies[0]);
    movieListRender(popularMovies);
  }
});

const form = document.querySelector("#search-form");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.querySelector<HTMLInputElement>("#search-input");
  if (input) {
    const searchData = await searchMovies(input.value);
    if (!searchData) return;
    resetListRender();
    movieListRender(searchData);
  }

  const bannerContainer = document.querySelector<HTMLElement>(
    ".background-container",
  );
  if (bannerContainer) {
    bannerContainer.style.display = "none";
  }

  const thumbnailTitle = document.querySelector("#thumbnail-title");
  if (thumbnailTitle && input) {
    thumbnailTitle.textContent = `"${input?.value}" 검색 결과`;
  }
});
