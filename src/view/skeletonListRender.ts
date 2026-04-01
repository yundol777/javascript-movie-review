export function skeletonListRender(count: number = 20): void {
  const thumbnailList = document.querySelector<HTMLElement>(".thumbnail-list");

  if (!thumbnailList) return;

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

  thumbnailList.insertAdjacentHTML("beforeend", skeletonList);
}

export function skeletonListRemover() {
  const skeletonList = document.querySelectorAll(".skeleton-card");

  skeletonList.forEach((element) => element.remove());
}
