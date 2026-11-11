import axios from "axios";
import type { Movie } from "../types/movie";

function isMovie(value: unknown): value is Movie {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "poster_path" in value &&
    (typeof value.poster_path === "string" || value.poster_path === null) &&
    "backdrop_path" in value &&
    (typeof value.backdrop_path === "string" || value.backdrop_path === null) &&
    "title" in value &&
    typeof value.title === "string" &&
    "overview" in value &&
    typeof value.overview === "string" &&
    "release_date" in value &&
    typeof value.release_date === "string" &&
    "vote_average" in value &&
    typeof value.vote_average === "number"
  );
}

export async function fetchMovies(
  query: string,
  signal: AbortSignal,
): Promise<Movie[]> {
  const token: unknown = import.meta.env.VITE_TMDB_TOKEN;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Missing TMDB access token");
  }

  const { data } = await axios.get<unknown>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query },
      headers: { Authorization: `Bearer ${token.trim()}` },
      signal,
    },
  );

  if (
    typeof data !== "object" ||
    data === null ||
    !("results" in data) ||
    !Array.isArray(data.results) ||
    !data.results.every(isMovie)
  ) {
    throw new Error("Invalid TMDB search response");
  }

  return data.results;
}
