export class AppState {
  #page;
  #isSearch;
  #searchValue;

  constructor() {
    this.#page = 1;
    this.#isSearch = false;
    this.#searchValue = "";
  }

  reset() {
    this.#page = 1;
    this.#isSearch = false;
    this.#searchValue = "";
  }

  resetSearch() {
    this.#page = 1;
    this.#isSearch = true;
    this.#searchValue = "";
  }

  getPage() {
    return this.#page;
  }

  getSearchValue() {
    return this.#searchValue;
  }

  getIsSearch() {
    return this.#isSearch;
  }

  increasePage() {
    this.#page++;
  }

  setValue(nextValue: string) {
    this.#searchValue = nextValue;
  }

  setIsSearch(nextIsSearch: boolean) {
    this.#isSearch = nextIsSearch;
  }
}
