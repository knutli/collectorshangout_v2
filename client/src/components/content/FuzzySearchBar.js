import Fuse from "fuse.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@nextui-org/react";

const FuzzySearchBar = ({ articles }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const viewArticle = (article) => {
    navigate(`/content/articles/${article.id}`); // Navigate to the article's page
  };

  const fuse = new Fuse(articles, {
    keys: ["title", "content", "summary"], // Fields to index for search
    includeScore: true,
  });

  const onSearch = ({ target }) => {
    setQuery(target.value);
    const searchResults = fuse.search(target.value);
    setResults(searchResults.map((result) => result.item));
  };

  return (
    <div>
      <Input
        clearable
        bordered
        placeholder="Søk blant artiklene..."
        value={query}
        onChange={onSearch}
      />
      {/* Display search results */}
      <div
        className="search-results-container"
        style={{ display: results.length > 0 ? "block" : "none" }}
      >
        {results.map((article) => (
          <div
            className="search-result-item"
            key={article.id}
            onClick={() => viewArticle(article)}
          >
            <strong>{article.title}</strong>
            <p>{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuzzySearchBar;
