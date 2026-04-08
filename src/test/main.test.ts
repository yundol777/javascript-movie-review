import { describe, expect, test } from "vitest";
import { getMovies } from "../api/getMovies";
import { searchMovies } from "../api/searchMovies";

describe("getMovies", () => {
  test("영화 목록을 반환한다", async () => {
    const moviesData = await getMovies(1);

    expect(moviesData).toBeDefined();
    if (moviesData) {
      expect(moviesData.results.length).toBeGreaterThan(0);
    }
  });
});

describe("searchMovies", () => {
  test("검색한 영화 목록을 반환한다", async () => {
    const moviesData = await searchMovies("해리포터", 1);

    expect(moviesData).toBeDefined();
    if (moviesData) {
      expect(moviesData.results.length).toBeGreaterThan(0);
    }
  });

  test("검색 결과가 없다면 빈 목록을 반환한다", async () => {
    const moviesData = await searchMovies("", 1);
    expect(moviesData?.results).toEqual([]);
  });
});
