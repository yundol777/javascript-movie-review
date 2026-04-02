import { OPTIONS } from "../constants/api";

export async function getMovies(
  page: number,
): Promise<movieResponse | undefined> {
  try {
    const response: Response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
      OPTIONS,
    );

    if (!response.ok) throw new Error("Error");

    const data: movieResponse = await response.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Error", e);
    }
  }
}
