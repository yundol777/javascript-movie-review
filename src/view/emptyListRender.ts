export function emptyListRender() {
  const thumbnailList = document.querySelector<HTMLElement>(".thumbnail-list");

  const emptyList = /*html*/ `
        <li class="thumbnail-empty">
            <img src="./templates/images/empty_icon.png" alt="empty list" class="empty-icon" />
            <p class="empty-message">검색 결과가 없습니다.</p>
        </li>
    `;

  if (thumbnailList) {
    thumbnailList.innerHTML = emptyList;
  }
}
