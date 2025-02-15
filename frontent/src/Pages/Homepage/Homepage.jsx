import React from 'react';
import Maincontent from '../../components/Maincontent/Maincontent';
import Mainsurvice from '../../components/Mainpage-survice/MainpageSurvice';

const Homepage = () => {
  return (
    <div>
      {/* <h1>Homepage</h1> */}
      <Maincontent />
      <Mainsurvice />
    </div>
  );
};

export default Homepage;
