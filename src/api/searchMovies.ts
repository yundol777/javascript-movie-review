const token = import.meta.env.VITE_API_TOKEN;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

export async function searchMovies(
  query: string,
  page: number,
): Promise<movieResponse | undefined> {
  try {
    const response: Response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=ko-KR&query=${query}&page=${page}`,
      options,
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
