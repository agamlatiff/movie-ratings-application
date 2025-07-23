import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`: `${API_BASE_URL}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.response === false) {
        setErrorMessage(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      
      setMovieList(data.results || [])
      
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    }
    
    finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <section className="all-movies mt-15">
          <h2 className="mt-[4 0px]">All Movies</h2>
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="max-sm:grid-cols-1">
              {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
