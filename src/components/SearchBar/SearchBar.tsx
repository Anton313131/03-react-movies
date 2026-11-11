import { useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [queryText, setQueryText] = useState("");

  function submitQuery(formData: FormData): void {
    const value = formData.get("query");
    const query = typeof value === "string" ? value.trim() : "";

    if (!query) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={css.form} action={submitQuery}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            autoFocus
            aria-label="Search movies"
            placeholder="Search movies..."
            value={queryText}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setQueryText(event.target.value)
            }
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
