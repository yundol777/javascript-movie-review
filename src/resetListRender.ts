export function resetListRender(): void {
  const thumbnailList = document.querySelector(".thumbnail-list");

  if (thumbnailList) {
    thumbnailList.innerHTML = "";
  }
}
