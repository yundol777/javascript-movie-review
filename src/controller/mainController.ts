import {
  morePopularController,
  moreSearchController,
} from "./moreButtonController";
import { popularController } from "./popularController";
import { searchController } from "./searchController";
import { AddButtonView } from "../view/addButtonView";
import { MovieBannerView } from "../view/movieBannerView";
import { MovieListView } from "../view/movieListView";
import { SearchView } from "../view/searchView";
import { AppState } from "../state/appState";
import { ModalView } from "../view/modalView";

export class MainController {
  #movieListView;
  #movieBannerView;
  #searchView;
  #addButtonView;
  #modalView;

  #appState;

  constructor() {
    this.#movieListView = new MovieListView((id: string) =>
      this.#handleMovieItem(id),
    );
    this.#movieBannerView = new MovieBannerView();
    this.#searchView = new SearchView(() => this.#handleSearch());
    this.#addButtonView = new AddButtonView(() => this.#handleAddButton());
    this.#modalView = new ModalView();

    this.#appState = new AppState();
  }

  async init() {
    const app = document.querySelector("#app");

    if (!app) return;

    this.#appState.reset();
    await popularController(
      this.#appState.getPage(),
      this.#movieListView,
      this.#movieBannerView,
      this.#addButtonView,
    );
  }

  async #handleSearch() {
    this.#appState.resetSearch();
    this.#addButtonView.show();

    this.#appState.setValue(this.#searchView.getValue());
    searchController(this.#appState, this.#movieListView, this.#addButtonView);

    this.#appState.setIsSearch(true);
    this.#movieBannerView.hide();

    this.#movieListView.setTitle(
      `"${this.#appState.getSearchValue()}" 검색 결과`,
    );
  }

  async #handleAddButton() {
    if (this.#appState.getIsSearch()) {
      moreSearchController(
        this.#appState,
        this.#movieListView,
        this.#addButtonView,
      );
    } else {
      morePopularController(
        this.#appState,
        this.#movieListView,
        this.#addButtonView,
      );
    }
  }

  async #handleMovieItem(id: string) {
    this.#modalView.isOpen();
  }
}
