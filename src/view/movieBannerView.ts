const BANNER_IMAGE_URL =
  "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";

export class MovieBannerView {
  #section;
  #headerBar;

  constructor() {
    this.#section = document.querySelector<HTMLElement>(
      ".background-container",
    );
    this.#headerBar = document.querySelector<HTMLElement>("#header-bar");
  }

  render(bannerMovie: Movies) {
    if (!this.#section) return;

    this.#section.style.backgroundImage = `url(${BANNER_IMAGE_URL + bannerMovie.poster_path})`;
    this.#section.innerHTML = /*html*/ `
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
