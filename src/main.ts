import { popularController } from "./controller/popularController";
import {
  comparePage,
  getMorePopular,
  getMoreSearch,
} from "./utils/handleMoreButton";
import { searchController } from "./controller/searchController";
import { inputView } from "./view/inputView";

let page = 1;
let isSearch = false;
let searchValue: string = "";

addEventListener("load", async () => {
  const app = document.querySelector("#app");

  if (app) {
    popularController(page);
  }
});

const addBtn = document.querySelector<HTMLButtonElement>("#add-button");

addBtn?.addEventListener("click", async () => {
  // let popularMovies: movieResponse | undefined;
  let nextData;
  page += 1;
  if (isSearch) {
    nextData = await getMoreSearch(page, searchValue);
  } else {
    nextData = await getMorePopular(page);
  }

  if (comparePage(nextData)) {
    addBtn.style.display = "none";
  }
});

const form = document.querySelector("#search-form");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  page = 1;

  searchValue = inputView();
  searchController(page, searchValue);

  isSearch = true;

  const bannerContainer = document.querySelector<HTMLElement>(
    ".background-container",
  );
  if (bannerContainer) {
    bannerContainer.style.display = "none";
  }

  const thumbnailTitle = document.querySelector("#thumbnail-title");
  if (thumbnailTitle) {
    thumbnailTitle.textContent = `"${searchValue}" 검색 결과`;
  }

  const headerBar = document.querySelector<HTMLElement>("#header-bar");
  if (headerBar) {
    headerBar.style.position = "relative";
  }
});
