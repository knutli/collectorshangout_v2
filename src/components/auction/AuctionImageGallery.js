import React, { useState } from "react";
import "../../styles/auctionView.css";

const AuctionImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // State to track zoom

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed); // Toggle zoom state
    if (!isZoomed) {
      document.body.classList.add("zoomed");
    } else {
      document.body.classList.remove("zoomed");
    }
  };

  return (
    <div className="auction-image-gallery">
      <div
        className={`auction-image-gallery__wrapper ${isZoomed ? "zoomed" : ""}`}
        style={{
          "--background-image-url": `url(${images[currentImageIndex]})`,
        }}
      >
        {/* Blurred background container */}
        <div className="auction-image-gallery__blurred-background">
          <img
            src={images[currentImageIndex]}
            alt={`Blurred Background`}
            className="auction-image-gallery__blurred"
          />
        </div>

        {/* Main image */}
        <img
          src={images[currentImageIndex]}
          alt={`Auction Image ${currentImageIndex + 1}`}
          className="auction-image-gallery__image"
          onClick={toggleZoom}
        />

        {/* Navigation buttons */}
        <button
          onClick={goToPreviousImage}
          className="auction-image-gallery__button previous"
        >
          &#8592;
        </button>
        <button
          onClick={goToNextImage}
          className="auction-image-gallery__button next"
        >
          &#8594;
        </button>
      </div>

      {/* Thumbnails */}
      <div className="auction-image-gallery__thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`auction-image-gallery__thumbnail ${
              currentImageIndex === index ? "active" : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionImageGallery;
