export class ModalView {
  #modalSection;
  #closeButton;

  constructor() {
    this.#modalSection = document.querySelector("#modalBackground");
    this.#closeButton = document.querySelector("#closeModal");
    this.#binding();
  }

  #binding() {
    if (!this.#closeButton) return;

    this.#closeButton.addEventListener("click", () => this.isClose());
    window.addEventListener("keydown", (event) => this.#escFunction(event));
  }

  #escFunction(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.isClose();
    }
  }

  isOpen() {
    if (!this.#modalSection) return;

    this.#modalSection.classList.add("active");
  }

  isClose() {
    if (!this.#modalSection) return;

    this.#modalSection.classList.remove("active");
  }
}
