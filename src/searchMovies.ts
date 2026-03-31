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
): Promise<Movies[] | undefined> {
  try {
    const response: Response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=ko-KR&query=${query}&page=1`,
      options,
    );

    const data: movieResponse = await response.json();
    return data.results;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Error", e);
    }
  }
}
