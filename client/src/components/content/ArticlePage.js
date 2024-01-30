import React from "react";
import { useParams } from "react-router-dom";
import sampleArticles from "./Articles";
import "../../styles/articleStyles.css";

const ArticlePage = () => {
  const { id } = useParams();
  const article = sampleArticles.find((a) => a.id === id);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="article-container">
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
    </div>
  );
};

export default ArticlePage;
