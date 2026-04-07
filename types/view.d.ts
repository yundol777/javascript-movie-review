interface MovieListViewType {
  setTitle(title: string): void;
  render(movieList: Movies[]): void;
  emptyRender(): void;
  errorRender(): void;
  skeletonRender(count?: number): void;
  skeletonRemover(): void;
  reset(): void;
}

interface MovieBannerViewType {
  render(bannerMovie: Movies): void;
  hide(): void;
}

interface AddButtonViewType {
  show(): void;
  hide(): void;
}
