import { OPTIONS } from "../constants/api";
import { ResponseError } from "../error/responseError";

export async function searchMovies(
  query: string,
  page: number,
): Promise<movieResponse> {
  try {
    const response: Response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=ko-KR&query=${query}&page=${page}`,
      OPTIONS,
    );

    if (!response.ok) {
      throw new ResponseError("[Error]: API 에러", "HTTP", response.status);
    }

    const data: movieResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    }

    throw new ResponseError("[Error]: 네트워크 에러", "NETWORK");
  }
}
