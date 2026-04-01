export function inputView() {
  const input = document.querySelector<HTMLInputElement>("#search-input");
  return input?.value ?? "";
}
