import { describe, expect, test } from "vitest";
import { getMovies } from "../getMovies";
import { searchMovies } from "../searchMovies";

describe("getMovies", () => {
  test("영화 목록을 반환한다", async () => {
    const movies = await getMovies();

    expect(movies).toBeDefined();
    if (movies) {
      expect(movies.length).toBeGreaterThan(0);
    }
  });
});

describe("searchMovies", () => {
  test("검색한 영화 목록을 반환한다", async () => {
    const movies = await searchMovies("해리포터");

    expect(movies).toBeDefined();
    if (movies) {
      expect(movies.length).toBeGreaterThan(0);
    }
  });

  test("검색 결과가 없다면 빈 목록을 반환한다", async () => {
    const movies = await searchMovies("");
    expect(movies).toEqual([]);
  });
});
