import React, { useState, useContext } from "react";
import { storage } from "../firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../AuthContext.js";
import TempHeader from "./content/TempHeader.js";
// import "../../src/styles/auctionCreate.css";

const AuctionCreateStepOne = ({ onNext, onCancel, previousData }) => {
  const { user } = useContext(AuthContext);

  const defaultData = {
    title: "",
    description: "",
    team: "",
    size: "",
    condition: "",
    player: "",
    leagueCountry: "",
    seasonAge: "",
    imageUrls: [],
  };

  const [auctionData, setAuctionData] = useState({
    ...defaultData,
    ...previousData,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setAuctionData({ ...auctionData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Append new files to the existing array
    setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // Create preview URLs for the selected images and add them to the existing previews
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const urls = await Promise.all(
      imageFiles.map(async (file) => {
        const imageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
      })
    );
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await uploadImages();
      const newAuctionData = { ...auctionData, imageUrls };
      onNext(newAuctionData);
    } catch (error) {
      console.error(
        "Error uploading images or submitting auction details:",
        error
      );
    }
  };

  return (
    <div>
      <TempHeader isBlackText={true} />
      <div className="auction-create-container">
        <h2 className="auction-create-title">Opprett auksjon</h2>
        {/* <div className="auction-create-title-divider"></div> */}
        <form onSubmit={handleSubmit} className="auction-form">
          {/* Left Column for input fields */}
          <div className="form-column">
            {/* Repeat pattern for input fields, using class names */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Tittel
              </label>
              <input
                type="text"
                name="title"
                value={auctionData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span className="input-form-helper-text">
                Legg til tittel her. Korte og konsise titler fungerer best.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Beskrivelse
              </label>
              <textarea
                type="text"
                name="description"
                wrap="soft"
                value={auctionData.description}
                onChange={handleChange}
                className="form-input description"
                required
              />
              <span className="input-form-helper-text">
                Legg til beskrivelse her. Når du selger ting hos oss er det
                viktig med en detaljert og oppriktig beskrivelse. Hvis du er i
                det kreative hjørnet, kan det lønne seg å bruke virkemidler som
                humor og historiefortelling, eller å spille på følelser.
                Annonsene som bruker dette aktivt er blant de mest populære.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="team" className="form-label">
                Lag
              </label>
              <input
                type="text"
                name="team"
                value={auctionData.team}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span className="input-form-helper-text">
                Hvilket fotballag er trøyen fra? Velg fra listen, eller start å
                skrive for å søke etter laget.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="size" className="form-label">
                Størrelse
              </label>
              <input
                type="text"
                name="size"
                value={auctionData.size}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-form-helper-text">
                En trøye skal oppgis som XS, S, M, L, XL, XXL eller 3XL.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="condition" className="form-label">
                Tilstand
              </label>
              <input
                type="text"
                name="condition"
                placeholder=" f.eks. 7/10"
                value={auctionData.condition}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-form-helper-text">
                Om du er usikker på hvordan vi vurderer tilstand kan du sjekke
                ut denne guiden.
              </span>
            </div>
          </div>
          {/* Right Column for image upload and tags */}
          <div className="form-column">
            <div className="form-group">
              {/* Image upload input and previews */}
              <label htmlFor="image" className="form-label">
                Last opp bilder
              </label>
              <div className="upload-box">
                <input
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="file-input"
                />
                <div className="image-preview-container">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index}`} />
                      <button
                        className="delete-preview"
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <span className="input-form-helper-text">
                Dra og slipp bilder i feltet over, eller trykk direkte på feltet
                for å laste opp bilder. Det er påkrevd å laste opp bilde av både
                trøyens front, bakside, samt innvendig lapp.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="player" className="form-label">
                Spiller
              </label>
              <input
                type="text"
                name="player"
                value={auctionData.player}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-form-helper-text">
                Dersom trøyen har print av navn bakpå, inkluder det her.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="leagueCountry" className="form-label">
                Land
              </label>
              <input
                type="text"
                name="leagueCountry"
                value={auctionData.leagueCountry}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-form-helper-text">
                Legg inn hvilket land/liga trøyen kommer fra.
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="seasonAge" className="form-label">
                Sesong
              </label>
              <input
                type="text"
                name="seasonAge"
                value={auctionData.seasonAge}
                onChange={handleChange}
                className="form-input"
              />
              <span className="input-form-helper-text">
                Legg til sesong her. Ikke påkrevd.
              </span>
            </div>

            <div className="form-footer">
              <span className="step-indicator">
                <strong>1/2</strong>
              </span>
              <button onClick={onCancel} className="cancel-button">
                Avbryt
              </button>

              <button type="submit" className="btn-primary">
                Neste
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionCreateStepOne;
