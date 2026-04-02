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
async function getMovies(page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
      OPTIONS
    );
    if (!response.ok) throw new Error("Error");
    const data = await response.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Error", e);
    }
  }
}
const bannerImageUrl = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
function movieBanner(bannerMovie) {
  const rateValue = document.querySelector(".rate-value");
  const title = document.querySelector(".title");
  const banner = document.querySelector(
    ".background-container"
  );
  if (!rateValue || !title || !banner) return;
  rateValue.textContent = String(bannerMovie.vote_average);
  title.textContent = bannerMovie.title;
  banner.style.backgroundImage = `url(${bannerImageUrl + bannerMovie.poster_path})`;
}
function movieListRender(popularMovies) {
  const thumbnailList = document.querySelector(".thumbnail-list");
  const thumbnailImage = "https://media.themoviedb.org/t/p/w200";
  popularMovies?.forEach((item) => {
    const list = (
      /*html*/
      `
      <li id=${item.id}>
        <div class="item">
          <img
            class="thumbnail"
            src=${thumbnailImage + item.poster_path}
            alt=${item.title}
            onerror="this.onerror=null; this.src='../public/images/no-image.png'"
        />
          <div class="item-desc">
            <p class="rate">
              <img
                src="../../public/images/star_empty.png"
                class="star"
              /><span class="item-rate">${item.vote_average}</span>
            </p>
            <strong class="item-title">${item.title}</strong>
          </div>
        </div>
        </li>
    `
    );
    thumbnailList?.insertAdjacentHTML("beforeend", list);
  });
}
function errorListRender() {
  const thumbnailList = document.querySelector(".thumbnail-list");
  const addBtn2 = document.querySelector("#add-button");
  const errorList = (
    /*html*/
    `
        <li class="thumbnail-empty">
            <img src="../../public/images/empty_icon.png" alt="empty list" class="empty-icon" />
            <p class="empty-message">영화 정보를 불러오지 못했습니다. 다시 시도해주세요.</p>
        </li>
    `
  );
  if (thumbnailList) {
    thumbnailList.innerHTML = errorList;
  }
  if (addBtn2) {
    addBtn2.style.display = "none";
  }
}
function skeletonListRender(count = 20) {
  const thumbnailList = document.querySelector(".thumbnail-list");
  if (!thumbnailList) return;
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
  thumbnailList.insertAdjacentHTML("beforeend", skeletonList);
}
function skeletonListRemover() {
  const skeletonList = document.querySelectorAll(".skeleton-card");
  skeletonList.forEach((element) => element.remove());
}
const PAGE_NUMBER = 1;
const SKELETON_NUMBER = 20;
async function popularController(page) {
  skeletonListRender(SKELETON_NUMBER);
  const popularMovies = await getMovies(page);
  if (popularMovies === void 0) {
    errorListRender();
    return;
  }
  skeletonListRemover();
  movieBanner(popularMovies.results[0]);
  movieListRender(popularMovies.results);
}
async function searchMovies(query, page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=ko-KR&query=${query}&page=${page}`,
      OPTIONS
    );
    if (!response.ok) throw new Error("Error");
    const data = await response.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Error", e);
    }
  }
}
function comparePage(moviesData) {
  if (moviesData === void 0) return false;
  return moviesData.page === moviesData.total_pages;
}
async function getNextData(stateObject2) {
  if (stateObject2.isSearch) {
    return await moreButtonController.getMoreSearch(
      stateObject2.page,
      stateObject2.searchValue
    );
  }
  return await moreButtonController.getMorePopular(stateObject2.page);
}
const moreButtonController = {
  handleLoadMore: async (stateObject2) => {
    stateObject2.page += 1;
    const nextData = await getNextData(stateObject2);
    return comparePage(nextData);
  },
  getMorePopular: async (page) => {
    skeletonListRender(SKELETON_NUMBER);
    const popularMoviesData = await getMovies(page);
    if (popularMoviesData === void 0) return;
    skeletonListRemover();
    movieListRender(popularMoviesData.results);
    return popularMoviesData;
  },
  getMoreSearch: async (page, searchValue) => {
    skeletonListRender(SKELETON_NUMBER);
    const searchMoviesData = await searchMovies(searchValue, page);
    if (searchMoviesData === void 0) return;
    skeletonListRemover();
    movieListRender(searchMoviesData.results);
    return searchMoviesData;
  }
};
function resetListRender() {
  const thumbnailList = document.querySelector(".thumbnail-list");
  if (thumbnailList) {
    thumbnailList.textContent = "";
  }
}
function emptyListRender() {
  const thumbnailList = document.querySelector(".thumbnail-list");
  const addBtn2 = document.querySelector("#add-button");
  const emptyList = (
    /*html*/
    `
        <li class="thumbnail-empty">
            <img src="../../public/images/empty_icon.png" alt="empty list" class="empty-icon" />
            <p class="empty-message">검색 결과가 없습니다.</p>
        </li>
    `
  );
  if (thumbnailList) {
    thumbnailList.innerHTML = emptyList;
  }
  if (addBtn2) {
    addBtn2.style.display = "none";
  }
}
const moreButton = document.querySelector("#add-button");
const controlMoreButton = {
  hide: () => {
    if (moreButton) moreButton.style.display = "none";
  },
  show: () => {
    if (moreButton) moreButton.style.display = "block";
  }
};
async function searchController(page, searchValue) {
  resetListRender();
  skeletonListRender(SKELETON_NUMBER);
  const searchMoviesResult = await searchMovies(
    searchValue,
    page
  );
  if (searchMoviesResult === void 0) {
    skeletonListRemover();
    errorListRender();
    return;
  }
  if (searchMoviesResult.total_results === 0) {
    skeletonListRemover();
    emptyListRender();
    return;
  }
  if (searchMoviesResult.page === searchMoviesResult.total_pages) {
    controlMoreButton.hide();
  }
  skeletonListRemover();
  movieListRender(searchMoviesResult.results);
}
function inputView() {
  const input = document.querySelector("#search-input");
  return input?.value ?? "";
}
const stateObject = {
  page: PAGE_NUMBER,
  isSearch: false,
  searchValue: ""
};
addEventListener("load", async () => {
  const app = document.querySelector("#app");
  if (app) {
    popularController(stateObject.page);
  }
});
const addBtn = document.querySelector("#add-button");
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
  const bannerContainer = document.querySelector(
    ".background-container"
  );
  if (bannerContainer) {
    bannerContainer.style.display = "none";
  }
  const thumbnailTitle = document.querySelector("#thumbnail-title");
  if (thumbnailTitle) {
    thumbnailTitle.textContent = `"${stateObject.searchValue}" 검색 결과`;
  }
  const headerBar = document.querySelector("#header-bar");
  if (headerBar) {
    headerBar.style.position = "relative";
  }
});
