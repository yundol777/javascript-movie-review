import {
  morePopularController,
  moreSearchController,
} from "./controller/moreButtonController";
import { popularController } from "./controller/popularController";
import { searchController } from "./controller/searchController";
import { AddButtonView } from "./view/addButtonView";
import { MovieBannerView } from "./view/movieBannerView";
import { MovieListView } from "./view/movieListView";
import { SearchView } from "./view/searchView";

export class MainController {
  #movieListView;
  #movieBannerView;
  #searchView;
  #addButtonView;

  #page;
  #isSearch;
  #searchValue;

  constructor() {
    this.#movieListView = new MovieListView();
    this.#movieBannerView = new MovieBannerView();
    this.#searchView = new SearchView(() => this.#handleSearch());
    this.#addButtonView = new AddButtonView(() => this.#handleAddButton());

    this.#page = 1;
    this.#isSearch = false;
    this.#searchValue = "";
  }

  async init() {
    const app = document.querySelector("#app");

    if (!app) return;

    this.#isSearch = false;
    this.#resetSearch();
    await popularController(
      this.#page,
      this.#movieListView,
      this.#movieBannerView,
    );
  }

  async #handleSearch() {
    this.#resetSearch();
    this.#addButtonView.show();

    this.#searchValue = this.#searchView.getValue();
    searchController(
      this.#page,
      this.#searchValue,
      this.#movieListView,
      this.#addButtonView,
    );

    this.#isSearch = true;
    this.#movieBannerView.hide();

    this.#movieListView.setTitle(`"${this.#searchValue}" 검색 결과`);
  }

  async #handleAddButton() {
    if (this.#isSearch) {
      moreSearchController(this.#page, this.#searchValue, this.#movieListView);
    } else {
      morePopularController(this.#page, this.#movieListView);
    }
  }

  #resetSearch() {
    this.#page = 1;
    this.#searchValue = "";
  }
}
