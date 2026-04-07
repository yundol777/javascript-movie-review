export class MovieListView {
  #titleSection;
  #listSection;

  constructor() {
    this.#listSection = document.querySelector(".thumbnail-list");
    this.#titleSection = document.querySelector("#thumbnail-title");
  }

  setTitle(title: string) {
    if (!this.#titleSection) return;
    this.#titleSection.textContent = title;
  }

  render(movieList: Movies[]) {
    const thumbnailImage = "https://media.themoviedb.org/t/p/w200";

    movieList?.forEach((item) => {
      const list = /*html*/ `
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
    `;

      if (!this.#listSection) return;
      this.#listSection.insertAdjacentHTML("beforeend", list);
    });
  }

  emptyRender() {
    this.reset();
    const emptyList = /*html*/ `
        <li class="thumbnail-empty">
            <img src="../../public/images/empty_icon.png" alt="empty list" class="empty-icon" />
            <p class="empty-message">검색 결과가 없습니다.</p>
        </li>
    `;

    if (!this.#listSection) return;
    this.#listSection.innerHTML = emptyList;
  }

  errorRender() {
    this.reset();
    const emptyList = /*html*/ `
        <li class="thumbnail-empty">
            <img src="../../public/images/empty_icon.png" alt="empty list" class="empty-icon" />
            <p class="empty-message">영화 정보를 불러오지 못했습니다. 다시 시도해주세요.</p>
        </li>
    `;

    if (!this.#listSection) return;
    this.#listSection.innerHTML = emptyList;
  }

  skeletonRender(count: number = 20): void {
    const skeletonList = Array.from({ length: count }, () => {
      return /*html*/ `
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
    `;
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
