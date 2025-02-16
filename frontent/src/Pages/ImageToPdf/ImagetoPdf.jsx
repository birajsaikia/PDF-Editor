import React, { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const imagetoPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      extractImagesFromPdf(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const extractImagesFromPdf = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      let extractedImages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        const imageUrl = canvas.toDataURL('image/jpeg', 1.0);
        extractedImages.push({ src: imageUrl, name: `Page_${i}.jpg` });
      }

      setImages(extractedImages);
    };
  };

  const handleDownloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.name;
    link.click();
  };

  return (
    <div className="container">
      <div className="upload-section">
        <div className="upload-section2">
          <div
            className="upload-box"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="upload-icon">⬆️</div>
            <p>Select a PDF file</p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          <div className="file-list">
            {files.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  src={image.src}
                  alt={image.name}
                  className="image-preview"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="options-section">
        <button className="convert-button" onClick={mergePDF}>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default imagetoPDF;
