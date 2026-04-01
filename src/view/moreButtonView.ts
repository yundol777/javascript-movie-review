const moreButton = document.querySelector<HTMLButtonElement>("#add-button");

export const controlMoreButton = {
  hide: () => {
    if (moreButton) moreButton.style.display = "none";
  },
  show: () => {
    if (moreButton) moreButton.style.display = "block";
  },
};
