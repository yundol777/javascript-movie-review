import { describe, expect, test } from "vitest";
import { getMovies } from "../getMovies";

describe("getMovies", () => {
  test("영화 목록을 반환한다", async () => {
    const movies = await getMovies();
    console.log(movies);

    expect(movies).toBeDefined();
    expect(movies.length).toBeGreaterThan(0);
  });
});
