(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDRhNDVlZjM1NjVlYmU3MTNjOTllYjM3NGY4OWFlMCIsIm5iZiI6MTc3NDg1MDEzMC42NTI5OTk5LCJzdWIiOiI2OWNhMTA1MjY0ZTg2ODU0ODk4Mzk0ZjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.SPnfuj9NVH9rzYu7H5sSi7DubMehTR9nTdPOcrPnn04";
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`
  }
};
class ResponseError extends Error {
  type;
  status;
  constructor(message, type, status) {
    super(message);
    this.type = type;
    this.status = status;
  }
}
async function getMovies(page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR&page=${page}`,
      OPTIONS
    );
    if (!response.ok) {
      throw new ResponseError("[Error]: API 에러", "HTTP", response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    }
    throw new ResponseError("[Error]: 네트워크 에러", "NETWORK");
  }
}
async function searchMovies(query, page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=ko-KR&region=KR&query=${query}&page=${page}`,
      OPTIONS
    );
    if (!response.ok) {
      throw new ResponseError("[Error]: API 에러", "HTTP", response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    }
    throw new ResponseError("[Error]: 네트워크 에러", "NETWORK");
  }
}
const SKELETON_NUMBER = 20;
const ERROR_MESSAGE = {
  DEFAULT: "문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  NETWORK: "네트워크 연결을 확인한 뒤 다시 시도해주세요.",
  HTTP: "영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  EMPTY: "검색 결과가 없습니다."
};
function isLastPage(moviesData) {
  return moviesData.page === moviesData.total_pages;
}
async function morePopularController(state, movieListView, addButtonView) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMoviesData = await getMovies(
      state.getNextPage()
    );
    if (isLastPage(popularMoviesData)) addButtonView.hide();
    state.increasePage();
    movieListView.render(popularMoviesData.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
async function moreSearchController(state, movieListView, addButtonView) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(
      state.getSearchValue(),
      state.getNextPage()
    );
    if (isLastPage(searchMoviesData)) addButtonView.hide();
    state.increasePage();
    movieListView.render(searchMoviesData.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      addButtonView.hide();
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
async function popularController(page, movieListView, movieBannerView, addButtonView) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMovies = await getMovies(page);
    if (popularMovies.results.length === 0) {
      movieListView.emptyRender();
      addButtonView.hide();
      return;
    }
    movieBannerView.render(popularMovies.results[0]);
    movieListView.render(popularMovies.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        addButtonView.hide();
        return;
      }
      if (error.type === "NETWORK") {
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        addButtonView.hide();
        return;
      }
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
      addButtonView.hide();
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
async function searchController(state, movieListView, addButtonView) {
  try {
    movieListView.reset();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesResult = await searchMovies(
      state.getSearchValue(),
      state.getPage()
    );
    if (searchMoviesResult.total_results === 0) {
      movieListView.emptyRender();
      addButtonView.hide();
      return;
    }
    if (isLastPage(searchMoviesResult)) {
      addButtonView.hide();
    }
    movieListView.render(searchMoviesResult.results);
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        addButtonView.hide();
        movieListView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
      addButtonView.hide();
      movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
    }
  } finally {
    movieListView.skeletonRemover();
  }
}
class AddButtonView {
  #section;
  #handler;
  constructor(handler) {
    this.#section = document.querySelector("#add-button");
    this.#handler = handler;
    this.#binding();
  }
  #binding() {
    this.#section?.addEventListener("click", () => {
      this.#handler();
    });
  }
  hide() {
    if (this.#section) {
      this.#section.style.display = "none";
    }
  }
  show() {
    if (this.#section) {
      this.#section.style.display = "block";
    }
  }
}
const BANNER_IMAGE_URL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
class MovieBannerView {
  #section;
  #headerBar;
  constructor() {
    this.#section = document.querySelector(
      ".background-container"
    );
    this.#headerBar = document.querySelector("#header-bar");
  }
  render(bannerMovie) {
    if (!this.#section) return;
    this.#section.style.backgroundImage = `url(${BANNER_IMAGE_URL + bannerMovie.poster_path})`;
    this.#section.innerHTML = /*html*/
    `
      <div class="overlay" aria-hidden="true"></div>
      <div class="top-rated-container">
        <div class="top-rated-movie">
          <div class="rate">
            <span class="rate-value">${bannerMovie.vote_average}</span>
          </div>
          <div class="title">${bannerMovie.title}</div>
          <button class="primary detail">자세히 보기</button>
        </div>
      </div>
    `;
  }
  hide() {
    if (!this.#section || !this.#headerBar) return;
    this.#section.style.display = "none";
    this.#headerBar.style.position = "relative";
  }
}
const emptyStar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
const emptyIcon = "/javascript-movie-review/assets/empty_icon-9C2OvmM-.png";
const noImage = "data:image/png;base64,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";
class MovieListView {
  #titleSection;
  #listSection;
  constructor() {
    this.#listSection = document.querySelector(".thumbnail-list");
    this.#titleSection = document.querySelector("#thumbnail-title");
  }
  setTitle(title) {
    if (!this.#titleSection) return;
    this.#titleSection.textContent = title;
  }
  render(movieList) {
    const thumbnailImage = "https://media.themoviedb.org/t/p/w200";
    movieList?.forEach((item) => {
      const list = (
        /*html*/
        `
      <li id=${item.id}>
        <div class="item">
          <img
            class="thumbnail"
            src=${thumbnailImage + item.poster_path}
            alt=${item.title}
            onerror="this.onerror=null; this.src='${noImage}'"
        />
          <div class="item-desc">
            <p class="rate">
              <img
                src="${emptyStar}"
                class="star"
              /><span class="item-rate">${item.vote_average}</span>
            </p>
            <strong class="item-title">${item.title}</strong>
          </div>
        </div>
        </li>
    `
      );
      if (!this.#listSection) return;
      this.#listSection.insertAdjacentHTML("beforeend", list);
    });
  }
  emptyRender() {
    this.reset();
    const emptyList = (
      /*html*/
      `
        <li class="thumbnail-empty">
            <img src="${emptyIcon}" alt="empty list" class="empty-icon" />
            <p class="empty-message">${ERROR_MESSAGE.EMPTY}</p>
        </li>
    `
    );
    if (!this.#listSection) return;
    this.#listSection.innerHTML = emptyList;
  }
  errorRender(message) {
    this.reset();
    const emptyList = (
      /*html*/
      `
        <li class="thumbnail-empty">
            <img src="${emptyIcon}" alt="empty list" class="empty-icon" />
            <p class="empty-message">${message}</p>
        </li>
    `
    );
    if (!this.#listSection) return;
    this.#listSection.innerHTML = emptyList;
  }
  skeletonRender(count = 20) {
    const skeletonList = Array.from({ length: count }, () => {
      return (
        /*html*/
        `
      <li class="skeleton-card" aria-hidden="true">
        <div class="item">
          <div class="thumbnail skeleton-box"></div>
          <div class="item-desc">
            <p class="rate">
              <span class="skeleton-star skeleton-box"></span>
              <span class="skeleton-score skeleton-box"></span>
            </p>
            <strong class="skeleton-title skeleton-box"></strong>
          </div>
        </div>
      </li>
    `
      );
    }).join("");
    if (!this.#listSection) return;
    this.#listSection.insertAdjacentHTML("beforeend", skeletonList);
  }
  skeletonRemover() {
    if (!this.#listSection) return;
    const skeletonList = this.#listSection.querySelectorAll(".skeleton-card");
    skeletonList.forEach((element) => element.remove());
  }
  reset() {
    if (!this.#listSection) return;
    this.#listSection.innerHTML = "";
  }
}
class SearchView {
  #handler;
  #section;
  constructor(handler) {
    this.#handler = handler;
    this.#section = document.querySelector("#search-form");
    this.#binding();
  }
  #binding() {
    this.#section?.addEventListener("submit", async (event) => {
      event.preventDefault();
      this.#handler();
    });
  }
  getValue() {
    const input = document.querySelector("#search-input");
    if (!input) return "";
    return input.value;
  }
}
class AppState {
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
  getNextPage() {
    return this.#page + 1;
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
  setValue(nextValue) {
    this.#searchValue = nextValue;
  }
  setIsSearch(nextIsSearch) {
    this.#isSearch = nextIsSearch;
  }
}
class MainController {
  #movieListView;
  #movieBannerView;
  #searchView;
  #addButtonView;
  #appState;
  constructor() {
    this.#movieListView = new MovieListView();
    this.#movieBannerView = new MovieBannerView();
    this.#searchView = new SearchView(() => this.#handleSearch());
    this.#addButtonView = new AddButtonView(() => this.#handleAddButton());
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
      this.#addButtonView
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
      `"${this.#appState.getSearchValue()}" 검색 결과`
    );
  }
  async #handleAddButton() {
    if (this.#appState.getIsSearch()) {
      moreSearchController(
        this.#appState,
        this.#movieListView,
        this.#addButtonView
      );
    } else {
      morePopularController(
        this.#appState,
        this.#movieListView,
        this.#addButtonView
      );
    }
  }
}
const mainController = new MainController();
mainController.init();
