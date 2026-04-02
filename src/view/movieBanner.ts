const bannerImageUrl = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";

export function movieBanner(bannerMovie: Movies) {
  const rateValue = document.querySelector(".rate-value");
  const title = document.querySelector(".title");
  const banner = document.querySelector<HTMLImageElement>(
    ".background-container",
  );

  if (!rateValue || !title || !banner) return;

  rateValue.textContent = String(bannerMovie.vote_average);
  title.textContent = bannerMovie.title;
  banner.style.backgroundImage = `url(${bannerImageUrl + bannerMovie.poster_path})`;
}
