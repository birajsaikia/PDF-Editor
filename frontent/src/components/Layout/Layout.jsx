import React from 'react';
import './Layout.css';
import Navbar from '../Navber/Navbar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="mt-20 w-[92%] m-auto min-h-[280px]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
