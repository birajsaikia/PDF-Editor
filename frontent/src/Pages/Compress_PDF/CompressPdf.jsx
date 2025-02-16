import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { PDFDocument } from 'pdf-lib';

const CompressPdf = () => {
  const [files, setFiles] = useState([]);
  const [compression, setCompression] = useState('medium');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newFiles = uploadedFiles.map((file, index) => ({
      src: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      file: file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles(files.filter((_, index) => index !== indexToDelete));
  };

  const handleCompressPDF = async () => {
    if (files.length === 0) {
      alert('Please upload at least one file.');
      return;
    }

    for (const file of files) {
      if (file.type === 'application/pdf') {
        await compressUploadedPDF(file);
      } else if (file.type.startsWith('image/')) {
        await convertImagesToPDF();
      }
    }
  };

  const compressUploadedPDF = async (file) => {
    const existingPdfBytes = await file.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdfDoc = await PDFDocument.create();

    for (const page of pdfDoc.getPages()) {
      const copiedPage = await newPdfDoc.copyPages(pdfDoc, [
        pdfDoc.getPages().indexOf(page),
      ]);
      newPdfDoc.addPage(copiedPage[0]);
    }

    const compressedPdfBytes = await newPdfDoc.save();
    downloadFile(compressedPdfBytes, 'compressed_pdf.pdf');
  };

  const convertImagesToPDF = async () => {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const imgBytes = await fetch(file.src).then((res) => res.arrayBuffer());
      const img = await pdfDoc.embedJpg(imgBytes, {
        quality: getCompressionLevel(),
      });

      const pageWidth = 595;
      const pageHeight = 842;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const imgWidth = pageWidth - 40;
      const imgHeight = (img.width / img.height) * imgWidth;

      page.drawImage(img, {
        x: 20,
        y: pageHeight - imgHeight - 20,
        width: imgWidth,
        height: imgHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    downloadFile(pdfBytes, 'compressed_images.pdf');
  };

  const getCompressionLevel = () => {
    if (compression === 'big') return 0.1;
    if (compression === 'medium') return 0.5;
    return 0.8;
  };

  const downloadFile = (pdfBytes, fileName) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="upload-section">
        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          <div className="upload-icon">⬆️</div>
          <p>Select JPG or PDF files</p>
          <input
            type="file"
            accept="image/jpeg,application/pdf"
            multiple
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <p className="file-name">{file.name}</p>
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="delete-icon"
                onClick={() => handleDeleteFile(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="options-section">
        <h2>Compression Options</h2>
        <div className="option-group">
          <button
            className="option-button"
            onClick={() => setCompression('big')}
          >
            High Compression
          </button>
          <button
            className="option-button"
            onClick={() => setCompression('medium')}
          >
            Medium Compression
          </button>
          <button
            className="option-button"
            onClick={() => setCompression('small')}
          >
            Low Compression
          </button>
        </div>
        <button className="convert-button" onClick={handleCompressPDF}>
          Compress & Download PDF
        </button>
      </div>
    </div>
  );
};

export default CompressPdf;
