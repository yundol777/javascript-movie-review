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
function isLastPage(moviesData) {
  return moviesData.page === moviesData.total_pages;
}
const ERROR_MESSAGE = {
  DEFAULT: "문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  NETWORK: "네트워크 연결을 확인한 뒤 다시 시도해주세요.",
  HTTP: "영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  EMPTY: "검색 결과가 없습니다."
};
function handleResponseError(error, movieListView, infiniteScrollView) {
  if (error instanceof ResponseError) {
    if (error.type === "HTTP") {
      movieListView.errorRender(ERROR_MESSAGE.HTTP);
      infiniteScrollView.stop();
      return;
    }
    if (error.type === "NETWORK") {
      movieListView.errorRender(ERROR_MESSAGE.NETWORK);
      infiniteScrollView.stop();
      return;
    }
  }
  movieListView.errorRender(ERROR_MESSAGE.DEFAULT);
  infiniteScrollView.stop();
}
async function morePopularController(state, movieListView, infiniteScrollView) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMoviesData = await getMovies(
      state.getNextPage()
    );
    if (isLastPage(popularMoviesData)) infiniteScrollView.stop();
    state.increasePage();
    movieListView.render(popularMoviesData.results);
  } catch (error) {
    handleResponseError(error, movieListView, infiniteScrollView);
  } finally {
    movieListView.skeletonRemover();
  }
}
async function moreSearchController(state, movieListView, infiniteScrollView) {
  try {
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(
      state.getSearchValue(),
      state.getNextPage()
    );
    if (isLastPage(searchMoviesData)) infiniteScrollView.stop();
    state.increasePage();
    movieListView.render(searchMoviesData.results);
  } catch (error) {
    handleResponseError(error, movieListView, infiniteScrollView);
  } finally {
    movieListView.skeletonRemover();
  }
}
async function popularController(page, movieListView, movieBannerView, infiniteScrollView) {
  try {
    movieListView.reset();
    infiniteScrollView.start();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const popularMovies = await getMovies(page);
    if (popularMovies.results.length === 0) {
      movieListView.emptyRender();
      infiniteScrollView.stop();
      return;
    }
    movieBannerView.render(popularMovies.results[0]);
    movieListView.render(popularMovies.results);
  } catch (error) {
    handleResponseError(error, movieListView, infiniteScrollView);
  } finally {
    movieListView.skeletonRemover();
  }
}
async function searchController(state, movieListView, infiniteScrollView) {
  try {
    movieListView.reset();
    infiniteScrollView.start();
    movieListView.skeletonRender(SKELETON_NUMBER);
    const searchMoviesResult = await searchMovies(
      state.getSearchValue(),
      state.getPage()
    );
    if (searchMoviesResult.total_results === 0) {
      movieListView.emptyRender();
      infiniteScrollView.stop();
      return;
    }
    if (isLastPage(searchMoviesResult)) {
      infiniteScrollView.stop();
    }
    movieListView.render(searchMoviesResult.results);
  } catch (error) {
    handleResponseError(error, movieListView, infiniteScrollView);
  } finally {
    movieListView.skeletonRemover();
  }
}
const BANNER_IMAGE_URL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
class MovieBannerView {
  #section;
  #headerBar;
  #handle;
  constructor(handle) {
    this.#section = document.querySelector(
      ".background-container"
    );
    this.#headerBar = document.querySelector("#header-bar");
    this.#handle = handle;
    this.#logoBinding();
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
            <img src="./src/asset/images/star_empty.png" class="star" />
            <span class="rate-value">${bannerMovie.vote_average}</span>
          </div>
          <div class="title">${bannerMovie.title}</div>
          <button class="primary detail">자세히 보기</button>
        </div>
      </div>
    `;
    this.#binding(bannerMovie.id);
  }
  #binding(id) {
    const detailButton = this.#section?.querySelector(".detail");
    if (!detailButton) return;
    detailButton.addEventListener("click", () => {
      this.#handle(id.toString());
    });
  }
  #logoBinding() {
    if (!this.#headerBar) return;
    const logo = this.#headerBar.querySelector(".logo");
    logo?.addEventListener("click", () => {
      window.location.reload();
    });
  }
  hide() {
    if (!this.#section || !this.#headerBar) return;
    this.#section.style.display = "none";
    this.#headerBar.style.position = "relative";
  }
}
const emptyStar = "./src/asset/images/star_empty.png";
const emptyIcon = "./src/asset/images/empty_icon.png";
const noImage = "./src/asset/images/no-image.png";
class MovieListView {
  #titleSection;
  #listSection;
  #handle;
  constructor(handle) {
    this.#listSection = document.querySelector(".thumbnail-list");
    this.#titleSection = document.querySelector("#thumbnail-title");
    this.#handle = handle;
    this.#binding();
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
      <li id=${item.id} class="thumbnail-item">
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
              /><span class="item-rate">${item.vote_average.toFixed(1)}</span>
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
  #binding() {
    if (!this.#listSection) return;
    this.#listSection.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const item = target.closest("li");
      if (!item?.id) return;
      this.#handle(item.id);
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
  #currentMovie;
  constructor() {
    this.#page = 1;
    this.#isSearch = false;
    this.#searchValue = "";
    this.#currentMovie = "";
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
  getCurrentMovie() {
    return this.#currentMovie;
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
  setCurrentMovie(movieId) {
    this.#currentMovie = movieId;
  }
}
const USER_RATE = {
  0: "별점을 입력해주세요",
  1: "최악이에요",
  2: "별로에요",
  3: "보통이에요",
  4: "재미있어요",
  5: "명작이에요"
};
function formatMovieMeta(date, genres = []) {
  const year = date.split("-")[0] || "";
  const genreNames = genres.map((genre) => genre.name).join(", ");
  if (!year) return genreNames;
  if (!genreNames) return year;
  return `${year} · ${genreNames}`;
}
class ModalView {
  #modalSection;
  #closeButton;
  #detailSection;
  #handle;
  constructor(handle) {
    this.#modalSection = document.querySelector("#modalBackground");
    this.#closeButton = document.querySelector("#closeModal");
    this.#detailSection = document.querySelector("#modalContainer");
    this.#handle = handle;
    this.#modalBinding();
  }
  #modalBinding() {
    this.#closeButton?.addEventListener("click", () => this.close());
    this.#modalSection?.addEventListener(
      "click",
      (event) => this.#backgroundClose(event)
    );
    window.addEventListener("keydown", (event) => this.#escFunction(event));
  }
  #escFunction(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }
  #backgroundClose(event) {
    if (event.target === this.#modalSection) {
      this.close();
    }
  }
  render(item, rateCount) {
    if (!this.#detailSection) return;
    this.#detailSection.innerHTML = `
         <div class="modal-image">
            <img
              src="https://image.tmdb.org/t/p/original/${item.poster_path}"
            />
          </div>
          <div class="modal-description">
            <div class="modal-title-section">
              <h2>${item.title}</h2>
              <p class="category">
                ${formatMovieMeta(item.release_date, item.genres)}
              </p>
              <div class="rate-section">
                <p>평균</p>
                <div class="rate">
                  <img src="./src/asset/images/star_filled.png" class="star" />
                  <p>${item.vote_average.toFixed(1)}</p>
                </div>
              </div>
            </div>
            <div class="modal-myrate-section">
              <h3 class="myrate-title">내 별점</h3>
              <div class="myrate-section">
                <div class="myrate-stars">
                  ${this.#renderStars(rateCount)}
                </div>
                <p class="myrate-comment">${USER_RATE[rateCount]} <span class="myrate-score">(${rateCount * 2}/10)</span></p>
              </div>
            </div>
            <div class="modal-detail-section">
              <h3 class="detail-title">줄거리</h3>
              <p class="detail">
                ${item.overview}
              </p>
            </div>
          </div>
    `;
    this.#starsBinding();
  }
  spinnerRender() {
    if (!this.#detailSection) return;
    this.#detailSection.innerHTML = `
      <div class="modal-loading">
        <div class="spinner"></div>
      </div>
    `;
  }
  errorRender(message) {
    const emptyList = (
      /*html*/
      `
          <div class="modal-error">
            <img src="./src/asset/images/empty_icon.png" alt="empty_icon" />
            <p>${message}</p>
          </div>
    `
    );
    if (!this.#detailSection) return;
    this.#detailSection.innerHTML = emptyList;
  }
  renderRate(rate) {
    const myComment = this.#detailSection?.querySelector(".myrate-comment");
    if (!myComment) return;
    myComment.innerHTML = `
      ${USER_RATE[rate]} <span class="myrate-score">(${rate * 2}/10)</span>
    `;
    const myStars = this.#detailSection?.querySelector(".myrate-stars");
    if (!myStars) return;
    myStars.innerHTML = `
      ${this.#renderStars(rate)}
    `;
  }
  #renderStars(rate) {
    return Array.from({ length: 5 }, (_, index) => {
      let starIcon = "star_filled";
      if (rate <= index) starIcon = "star_empty";
      return `
        <img
          src="./src/asset/images/${starIcon}.png"
          alt="star"
          id="${index + 1}"
        />
      `;
    }).join("");
  }
  #starsBinding() {
    const starSection = this.#detailSection?.querySelector(".myrate-stars");
    starSection?.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const item = target.closest("img");
      if (!item?.id) return;
      this.#handle(item.id);
    });
  }
  open() {
    if (!this.#modalSection) return;
    document.body.style.overflow = "hidden";
    this.#modalSection.classList.add("active");
  }
  close() {
    if (!this.#modalSection) return;
    document.body.style.overflow = "auto";
    this.#modalSection.classList.remove("active");
  }
}
async function getDetail(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=ko-KR&region=KR`,
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
async function getRate(movieId) {
  const rate = localStorage.getItem(movieId);
  return rate;
}
async function modalController(id, modalView, state) {
  try {
    modalView.spinnerRender();
    const movieDetail = await getDetail(Number(id));
    state.setCurrentMovie(id);
    const myRate = await getRate(id);
    if (myRate === null) {
      modalView.render(movieDetail, 0);
      return;
    }
    modalView.render(movieDetail, Number(myRate));
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.type === "HTTP") {
        modalView.errorRender(ERROR_MESSAGE.HTTP);
        return;
      }
      if (error.type === "NETWORK") {
        modalView.errorRender(ERROR_MESSAGE.NETWORK);
        return;
      }
    }
    modalView.errorRender(ERROR_MESSAGE.DEFAULT);
  }
}
async function setRate(movieId, rate) {
  localStorage.setItem(movieId, rate);
}
async function rateController(rate, modalView, state) {
  await setRate(state.getCurrentMovie(), rate);
  modalView.renderRate(Number(rate));
}
class InfiniteScrollView {
  #sentinel;
  #observer;
  constructor(getObserver) {
    this.#sentinel = document.querySelector("#sentinel");
    this.#observer = getObserver();
  }
  start() {
    if (!this.#sentinel) return;
    this.#observer.observe(this.#sentinel);
  }
  stop() {
    this.#observer.disconnect();
  }
}
class MainController {
  #movieListView;
  #movieBannerView;
  #searchView;
  #infiniteScrollView;
  #modalView;
  #appState;
  constructor() {
    this.#movieListView = new MovieListView(
      (id) => this.#handleMovieItem(id)
    );
    this.#movieBannerView = new MovieBannerView(
      (id) => this.#handleMovieItem(id)
    );
    this.#searchView = new SearchView(() => this.#handleSearch());
    this.#modalView = new ModalView((id) => this.#handleRate(id));
    this.#infiniteScrollView = new InfiniteScrollView(
      () => this.#getObserver()
    );
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
      this.#infiniteScrollView
    );
  }
  async #handleSearch() {
    this.#appState.resetSearch();
    this.#appState.setValue(this.#searchView.getValue());
    await searchController(
      this.#appState,
      this.#movieListView,
      this.#infiniteScrollView
    );
    this.#appState.setIsSearch(true);
    this.#movieBannerView.hide();
    this.#movieListView.setTitle(
      `"${this.#appState.getSearchValue()}" 검색 결과`
    );
  }
  #getObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.#handleAddButton();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0
      }
    );
    return observer;
  }
  async #handleAddButton() {
    if (this.#appState.getIsSearch()) {
      moreSearchController(
        this.#appState,
        this.#movieListView,
        this.#infiniteScrollView
      );
    } else {
      morePopularController(
        this.#appState,
        this.#movieListView,
        this.#infiniteScrollView
      );
    }
  }
  async #handleMovieItem(id) {
    this.#modalView.open();
    modalController(id, this.#modalView, this.#appState);
  }
  async #handleRate(rate) {
    rateController(rate, this.#modalView, this.#appState);
  }
}
const mainController = new MainController();
mainController.init();
