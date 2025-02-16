import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'; // ✅ Import the icon

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './MergePdf.css';
// // import { Worker } from '@react-pdf-viewer/core';
// import { pdfjs } from 'react-pdf';

// // Set PDF.js worker path
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js`;

const MergePdf = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedPdfs = JSON.parse(localStorage.getItem('uploadedPdfs')) || [];
    setPdfFiles(storedPdfs);
  }, []);

  const handlePlaceholderClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfs = files
      .filter((file) => file.type === 'application/pdf')
      .map((file) => ({
        name: file.name,
        file,
        url: URL.createObjectURL(file),
      }));

    const updatedPdfs = [...pdfFiles, ...pdfs];
    setPdfFiles(updatedPdfs);
    localStorage.setItem('uploadedPdfs', JSON.stringify(updatedPdfs));
  };

  const handleDelete = (fileToRemove) => {
    const updatedPdfs = pdfFiles.filter(
      (file) => file.name !== fileToRemove.name
    );
    setPdfFiles(updatedPdfs);
    localStorage.setItem('uploadedPdfs', JSON.stringify(updatedPdfs));
  };

  const mergePDF = async () => {
    if (pdfFiles.length === 0) {
      alert('No PDFs uploaded!');
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (let file of pdfFiles) {
      const fileBytes = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
  };

  return (
    <div className="container">
      <div className="upload-section">
        <div className="upload-section2">
          <div
            className="upload-box"
            onClick={handlePlaceholderClick}
            style={{ flex: '0.5' }}
          >
            <div className="upload-icon">
              <FontAwesomeIcon
                icon={faArrowUpFromBracket}
                style={{ fontSize: '100px', color: 'rgb(194 33 29)' }}
              />
            </div>
            <p>Select PDF files to merge</p>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          <div className="file-list">
            {pdfFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="pdf-preview">
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js`}
                  >
                    <Viewer fileUrl={file.url} />
                  </Worker>
                </div>
                <p className="file-name">{file.name}</p>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="delete-icon"
                  onClick={() => handleDelete(file)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="options-section">
        <button className="convert-button" onClick={mergePDF}>
          Merge PDFs
        </button>
      </div>
    </div>
  );
};

export default MergePdf;
