import React from 'react';
import './MainpageSurvice.css';

export default function MainpageSurvice() {
  return (
    <div className="maincontain">
      <h1>Every tool you need to work with PDFs in one place</h1>
      <p>
        Every tool you need to use PDFs, at your fingertips. All are 100% FREE
        and easy to use! Merge, <br></br>split, compress, convert, rotate,
        unlock and watermark PDFs with just a few clicks.
      </p>
      <div className="survicecontent">
        <div className="compress-button">
          <img src="pdf-icon.png" alt="Compress PDF" className="icon" />
          <p>Compress Pdf</p>
        </div>
        <div className="compress-button">
          <img src="pdf-icon.png" alt="Compress PDF" className="icon" />
          <p>Compress Pdf</p>
        </div>
        <div className="compress-button">
          <img src="pdf-icon.png" alt="Compress PDF" className="icon" />
          <p>Compress Pdf</p>
        </div>
        <div className="compress-button">
          <img src="pdf-icon.png" alt="Compress PDF" className="icon" />
          <p>Compress Pdf</p>
        </div>
      </div>
    </div>
  );
}
