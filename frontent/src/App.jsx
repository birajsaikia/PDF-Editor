import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './Pages/Homepage/Homepage';
import ImageToPdf from './Pages/ImageToPdf/ImageToPdf';
import ConvertToPdf from './Pages/Convert_PDF/ConvertPdf';
import MergeToPdf from './Pages/MergePdf/MergePdf';
import CompressPDF from './Pages/Compress_PDF/CompressPdf';
import NotFound from './Pages/Not_Found/NotFound';
import Navber from './components/Navber/Navbar';

const App = () => {
  return (
    <Router>
      <Navber />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/convert-pdf" element={<ConvertToPdf />} />
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/merge-pdf" element={<MergeToPdf />} />
        <Route path="/compress-pdf" element={<CompressPDF />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
