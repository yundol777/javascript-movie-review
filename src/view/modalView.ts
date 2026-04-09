export class ModalView {
  #modalSection;
  #closeButton;
  #detailSection;

  constructor() {
    this.#modalSection = document.querySelector("#modalBackground");
    this.#closeButton = document.querySelector("#closeModal");
    this.#detailSection = document.querySelector("#modalContainer");
    this.#binding();
  }

  #binding() {
    if (!this.#closeButton) return;

    this.#closeButton.addEventListener("click", () => this.close());
    window.addEventListener("keydown", (event) => this.#escFunction(event));
  }

  #escFunction(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  render(item: MovieItem) {
    if (!this.#detailSection) return;

    this.#detailSection.innerHTML = `<div class="modal-image">
            <img
              src="https://image.tmdb.org/t/p/original/${item.poster_path}"
            />
          </div>
          <div class="modal-description">
            <h2>${item.title}</h2>
            <p class="category">
              ${item.release_date} · ${item.tagline}
            </p>
            <p class="rate">
              <img src="/images/star_filled.png" class="star" /><span
                >${item.vote_average}</span
              >
            </p>
            <hr />
            <p class="detail">
              ${item.overview}
            </p>
          </div>`;
  }

  open() {
    if (!this.#modalSection) return;

    this.#modalSection.classList.add("active");
  }

  close() {
    if (!this.#modalSection) return;

    this.#modalSection.classList.remove("active");
  }
}
