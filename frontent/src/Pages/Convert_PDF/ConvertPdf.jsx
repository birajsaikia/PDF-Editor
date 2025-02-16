import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // FontAwesome Trash Icon
import { PDFDocument } from 'pdf-lib';
import './ConvertPdf.css';

const ConvertPdf = () => {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('portrait'); // Page orientation
  const [pageSize, setPageSize] = useState('A4'); // Page size
  const [margin, setMargin] = useState('medium'); // Margin size
  const [mergeImages, setMergeImages] = useState(false); // Merge option
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

  // Function to generate and download the PDF
  const handleConvertToPDF = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image to convert to PDF');
      return;
    }

    const pdfDoc = await PDFDocument.create();

    for (const image of images) {
      const imgBytes = await fetch(image.src).then((res) => res.arrayBuffer());
      const img = await pdfDoc.embedJpg(imgBytes);

      // Define page sizes for A4 and A3
      let pageWidth, pageHeight;
      if (pageSize === 'A4') {
        pageWidth = 595;
        pageHeight = 842;
      } else if (pageSize === 'A3') {
        pageWidth = 842;
        pageHeight = 1191;
      }

      // Apply orientation
      if (orientation === 'landscape') {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Apply margins
      const marginValue = margin === 'big' ? 50 : margin === 'medium' ? 30 : 10;

      // Adjust image size based on margins
      const imgWidth = pageWidth - 2 * marginValue;
      const imgHeight = (img.width / img.height) * imgWidth;

      page.drawImage(img, {
        x: marginValue,
        y: pageHeight - imgHeight - marginValue,
        width: imgWidth,
        height: imgHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Download the generated PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_images.pdf';
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
    localStorage.removeItem('uploadedImages');
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
        <h2>Options</h2>
        <div className="option-group">
          <h3>Page Orientation</h3>
          <button
            className="option-button"
            onClick={() => setOrientation('portrait')}
          >
            Portrait
          </button>
          <button
            className="option-button"
            onClick={() => setOrientation('landscape')}
          >
            Landscape
          </button>
        </div>
        <div className="option-group">
          <h3>Page Size</h3>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="page-size-dropdown"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
          </select>
        </div>
        <div className="option-group">
          <h3>Margin</h3>
          <button className="option-button2" onClick={() => setMargin('big')}>
            Big
          </button>
          <button
            className="option-button2"
            onClick={() => setMargin('medium')}
          >
            Medium
          </button>
          <button className="option-button2" onClick={() => setMargin('small')}>
            Small
          </button>
        </div>
        <button className="convert-button" onClick={handleConvertToPDF}>
          Convert to PDF
        </button>
      </div>
    </div>
  );
};

export default ConvertPdf;
