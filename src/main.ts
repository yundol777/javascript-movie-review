import { popularController } from "./controller/popularController";
import { moreButtonController } from "./controller/moreButtonController";
import { searchController } from "./controller/searchController";
import { inputView } from "./view/inputView";
import { PAGE_NUMBER } from "./constants/constant";

const stateObject: StateType = {
  page: PAGE_NUMBER,
  isSearch: false,
  searchValue: "",
};

addEventListener("load", async () => {
  const app = document.querySelector("#app");

  if (app) {
    popularController(stateObject.page);
  }
});

const addBtn = document.querySelector<HTMLButtonElement>("#add-button");

addBtn?.addEventListener("click", async () => {
  const result = await moreButtonController.handleLoadMore(stateObject);

  if (result) {
    addBtn.style.display = "none";
  }
});

const form = document.querySelector("#search-form");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  stateObject.page = 1;

  if (addBtn) {
    addBtn.style.display = "block";
  }

  stateObject.searchValue = inputView();
  searchController(stateObject.page, stateObject.searchValue);

  stateObject.isSearch = true;

  const bannerContainer = document.querySelector<HTMLElement>(
    ".background-container",
  );
  if (bannerContainer) {
    bannerContainer.style.display = "none";
  }

  const thumbnailTitle = document.querySelector("#thumbnail-title");
  if (thumbnailTitle) {
    thumbnailTitle.textContent = `"${stateObject.searchValue}" 검색 결과`;
  }

  const headerBar = document.querySelector<HTMLElement>("#header-bar");
  if (headerBar) {
    headerBar.style.position = "relative";
  }
});
