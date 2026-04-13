export class AddButtonView {
  #section;
  #handler;

  constructor(handler: () => void) {
    this.#section = document.querySelector<HTMLButtonElement>("#add-button");
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
