export function movieListRender(popularMovies: Movies[]): void {
  const thumbnailList = document.querySelector(".thumbnail-list");
  const thumbnailImage = "https://media.themoviedb.org/t/p/w440_and_h660_face";

  popularMovies?.forEach((item) => {
    const list = /*html*/ `
      <li id=${item.id}>
        <div class="item">
          <img
            class="thumbnail"
            src=${thumbnailImage + item.poster_path}
            alt=${item.title}
        />
          <div class="item-desc">
            <p class="rate">
              <img
                src="./templates/images/star_empty.png"
                class="star"
              /><span>${item.vote_average}</span>
            </p>
            <strong>${item.title}</strong>
          </div>
        </div>
        </li>
    `;

    thumbnailList?.insertAdjacentHTML("beforeend", list);
  });
}
