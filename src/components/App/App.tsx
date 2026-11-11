import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";

type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; movies: Movie[] }
  | { kind: "error" };

const emptyResultsToastId = "empty-results";

export default function App() {
  const [search, setSearch] = useState<SearchState>({ kind: "idle" });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const activeRequest = useRef<AbortController>(null);

  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  const closeMovie = useCallback(() => setSelectedMovie(null), []);

  async function searchMovies(query: string): Promise<void> {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    toast.dismiss(emptyResultsToastId);
    setSearch({ kind: "loading" });

    try {
      const movies = await fetchMovies(query, controller.signal);
      if (controller.signal.aborted) return;

      setSearch({ kind: "success", movies });
      if (movies.length === 0) {
        toast.error("No movies found for your request.", {
          id: emptyResultsToastId,
        });
      }
    } catch {
      if (!controller.signal.aborted) setSearch({ kind: "error" });
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return (
    <>
      <SearchBar onSubmit={(query) => void searchMovies(query)} />
      <main className={css.app}>
        {search.kind === "loading" && <Loader />}
        {search.kind === "error" && <ErrorMessage />}
        {search.kind === "success" && search.movies.length > 0 && (
          <MovieGrid movies={search.movies} onSelect={setSelectedMovie} />
        )}
      </main>
      <footer className={css.attribution}>
        <img src="/tmdb-logo.svg" alt="TMDB" width={64} />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
      <Toaster />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeMovie} />
      )}
    </>
  );
}
