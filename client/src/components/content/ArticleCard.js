import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const viewArticle = () => {
    navigate(`/articles/${article.id}`); // Navigate to the article's page
  };

  return (
    <Link to={`/content/articles/${article.id}`}>
      <Card onClick={viewArticle} className="article-card py-4 mb-5">
        <Image
          alt="Card background"
          className="article-card-image"
          src={article.cardImage}
        />
        <CardHeader className="card-header-text">
          <strong>
            <p>{article.title}</p>
          </strong>
        </CardHeader>
        <CardBody className="card-summary-text">
          <p>{article.summary}</p>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ArticleCard;
