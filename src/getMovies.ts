const token = import.meta.env.VITE_API_TOKEN;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

export async function getMovies() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
      options,
    );

    const data = await response.json();
    return data.results;
  } catch (e) {
    console.error("error");
  }
}
