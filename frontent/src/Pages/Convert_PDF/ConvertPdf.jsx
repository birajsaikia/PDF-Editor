import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // FontAwesome Trash Icon
import './ConvertPdf.css';
import { colors } from '@mui/material';

const ConvertPdf = () => {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('portrait'); // Track orientation
  const [pageSize, setPageSize] = useState('A4'); // Track page size
  const [margin, setMargin] = useState('medium'); // Track margin size
  const [mergeImages, setMergeImages] = useState(false); // Track merge option
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedImages =
      JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setImages(savedImages);
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file, index) => ({
      src: URL.createObjectURL(file),
      name: `Image ${images.length + index + 1}`,
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);
    setImages(updatedImages);
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
  };

  // Handle change in page orientation
  const handleOrientationChange = (orientation) => {
    setOrientation(orientation);
  };

  // Handle page size change (Dropdown)
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  // Handle margin size change
  const handleMarginChange = (size) => {
    setMargin(size);
  };

  // Handle merge checkbox change
  const handleMergeChange = () => {
    setMergeImages(!mergeImages);
  };

  // Function to generate and download the PDF
  const handleConvertToPDF = () => {
    // Creating a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Default A4 page size (Portrait, 210 x 297 mm)
    const pageWidth = 210;
    const pageHeight = 297;

    // Adjust for page size selection
    let imgWidth = pageWidth;
    let imgHeight = pageHeight;

    if (pageSize === 'A4') {
      imgWidth = 210;
      imgHeight = 297;
    } else if (pageSize === 'A3') {
      imgWidth = 297;
      imgHeight = 420;
    }

    // Apply margin values
    const marginValue = margin === 'big' ? 20 : margin === 'medium' ? 15 : 10;

    let currentPage = 1;

    // Generate PDF content (Base64 images)
    const pdfContent = [];

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.src;

      img.onload = () => {
        // Set the canvas size to the page size
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // Draw the image on the canvas with margin
        ctx.drawImage(
          img,
          marginValue,
          marginValue,
          imgWidth - 2 * marginValue,
          imgHeight - 2 * marginValue
        );
        console.log(pageSize, margin, orientation);
        // Save the canvas content as base64
        pdfContent.push(canvas.toDataURL('image/png'));

        // If mergeImages is false, generate a new page for each image
        if (!mergeImages || index === images.length - 1) {
          // Create an anchor element to trigger download
          const downloadLink = document.createElement('a');
          downloadLink.href = pdfContent[index];
          downloadLink.download = 'converted_images.pdf';
          downloadLink.click();
          localStorage.removeItem('uploadedImages');
        }
      };
    });
  };

  return (
    <div className="container">
      <div className="upload-section">
        <div className="upload-section2">
          <div className="upload-box" onClick={handlePlaceholderClick}>
            <div className="upload-icon">⬆️</div>
            <p>Select JPG images or drop JPG images here</p>
            <input
              type="file"
              accept="image/jpeg"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>

          <div className="image-list">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={image.src}
                    alt={`uploaded-${index}`}
                    className="image-placeholder"
                    onClick={handlePlaceholderClick}
                  />
                  <div className="image-info">
                    <p className="image-name">{image.name}</p>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="delete-icon"
                      onClick={() => handleDeleteImage(index)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      <div className="options-section">
        <h2>Option</h2>
        <div className="option-group">
          <h3>Page orientation</h3>
          <button
            className="option-button"
            onClick={() => handleOrientationChange('portrait')}
          >
            Portrait
          </button>
          <button
            className="option-button"
            onClick={() => handleOrientationChange('landscape')}
          >
            Landscape
          </button>
        </div>
        <div className="option-group">
          <h3>Page size</h3>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="page-size-dropdown"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
          </select>
        </div>
        <div className="option-group">
          <h3>Margin</h3>
          <button
            className="option-button2"
            onClick={() => handleMarginChange('big')}
          >
            Big
          </button>
          <button
            className="option-button2"
            onClick={() => handleMarginChange('medium')}
          >
            Medium
          </button>
          <button
            className="option-button2"
            onClick={() => handleMarginChange('small')}
          >
            Small
          </button>
        </div>
        <div className="option-group">
          <input
            type="checkbox"
            id="merge"
            checked={mergeImages}
            onChange={handleMergeChange}
          />
          <label htmlFor="merge">Merge all images in one PDF file</label>
        </div>
        <button className="convert-button" onClick={handleConvertToPDF}>
          Convert to PDF
        </button>
      </div>
    </div>
  );
};

export default ConvertPdf;
