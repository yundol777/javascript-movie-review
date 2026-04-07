export class SearchView {
  #handler;
  #section;

  constructor(handler: () => void) {
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
    const input = document.querySelector<HTMLInputElement>("#search-input");
    if (!input) return "";

    return input.value;
  }
}
