import React, { useState } from "react";
import FuzzySearchBar from "./FuzzySearchBar";
import ArticleCard from "./ArticleCard";
import sampleArticles from "./Articles";
import "../../styles/content.css";
import TempHeader from "./TempHeader";

const MainContent = () => {
  const [articles] = useState(sampleArticles);

  return (
    <div>
      {" "}
      <TempHeader />
      <div className="main-content-container">
        <div className="content-header"></div>
        <div className="search-bar-container">
          <FuzzySearchBar articles={articles} />
        </div>
        <div className="card-container">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
