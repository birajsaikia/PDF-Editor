import React from 'react';
import './Maincontent.css'; // Import CSS file
import Banner from '../../assets/banner.png';
import TextField from '@mui/material/TextField';

const Maincontent = () => {
  return (
    <div className="main-content">
      <div>
        <h1>Edit, Merge, Convert – Your PDF, Your Way!</h1>
        <p>
          Our PDF editor is a fast, secure, and user-friendly tool for editing,
          merging, converting, and managing PDFs effortlessly.<br></br> Whether
          you need to modify text, add images, or split files, our platform
          makes it simple. Enjoy seamless editing<br></br> with a smooth
          experience—anytime, anywhere!
        </p>
        <TextField
          label="search your service"
          variant="outlined" // Options: "outlined", "filled", "standard"
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          sx={{
            input: { color: 'white', width: '50px' },

            '& .MuiOutlinedInput-root': {},
            '& fieldset': { borderColor: 'white' },
          }}
        />
      </div>
      <div>
        <img src={Banner} alt="" />
      </div>
    </div>
  );
};

export default Maincontent;
