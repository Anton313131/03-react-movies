# Movie search

Search TMDB by movie title. Select a result to see its overview, release date, and rating.

## Run locally

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`. Set `VITE_TMDB_TOKEN` to your TMDB API Read Access Token from [TMDB API settings](https://www.themoviedb.org/settings/api).
3. Run `npm run dev`.

Run `npm run lint` and `npm run build` to check the project.

## Deploy to Vercel

Import the repository as a Vite project. Set `VITE_TMDB_TOKEN` in the project's Production environment before deploying. Vite includes this value in the browser bundle, so use a dedicated read token.

Component styles come from [GoIT's movie gallery styles](https://github.com/goitacademy/react-movies-styles/tree/11038be49221ffffd23a28d81c67ff6665aa2efc).
