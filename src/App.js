import React, { useState } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";
import { useEffect } from "react";
import { useCallback } from "react";

function App() {
  const [movies, getMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("ERROR: Ops... Could not fetch any movies!");
      }
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      getMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function clearMoviesHandler() {
    getMovies((prev) => []);
  }

  const addMovieHandler = (movie) => {
    fetch(
      "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => fetchMoviesHandler());
  };

  let content;
  if (isLoading) {
    content = (
      <p>
        <strong>Loading...</strong>
      </p>
    );
  }

  if (!isLoading && error) {
    content = (
      <p>
        <strong>{error}</strong>
      </p>
    );
  }

  if (movies.length <= 0 && !isLoading) {
    content = (
      <p>
        <strong>Your list is empty, try to fetch some more movies!</strong>
      </p>
    );
  }

  if (movies.length > 0 && !isLoading) {
    content = <MoviesList movies={movies} />;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={clearMoviesHandler}>Clear Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
