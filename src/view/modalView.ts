import { USER_RATE } from "../constants/rate";
import { formatMovieMeta } from "../utils/formatMovieMeta";

export class ModalView {
  #modalSection;
  #closeButton;
  #detailSection;
  #handle;

  constructor(handle: (id: string) => {}) {
    this.#modalSection = document.querySelector("#modalBackground");
    this.#closeButton = document.querySelector("#closeModal");
    this.#detailSection = document.querySelector("#modalContainer");
    this.#handle = handle;
    this.#modalBinding();
  }

  #modalBinding() {
    this.#closeButton?.addEventListener("click", () => this.close());
    this.#modalSection?.addEventListener("click", (event) =>
      this.#backgroundClose(event),
    );
    window.addEventListener("keydown", (event) => this.#escFunction(event));
  }

  #escFunction(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  #backgroundClose(event: Event) {
    if (event.target === this.#modalSection) {
      this.close();
    }
  }

  render(item: MovieItem, rateCount: number) {
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

  errorRender(message: string) {
    const emptyList = /*html*/ `
          <div class="modal-error">
            <img src="./src/asset/images/empty_icon.png" alt="empty_icon" />
            <p>${message}</p>
          </div>
    `;

    if (!this.#detailSection) return;
    this.#detailSection.innerHTML = emptyList;
  }

  renderRate(rate: number) {
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

  #renderStars(rate: number) {
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
