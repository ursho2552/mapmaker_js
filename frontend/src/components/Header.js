// src/components/Header.js
import React from 'react';

const Header = ({ X, Z, M }) => {
  return (
    <div>
      <h1>Display {X} predicted by {Z} as {M}</h1>
    </div>
  );
};

export default Header;

