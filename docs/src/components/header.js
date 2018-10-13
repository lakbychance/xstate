import React from 'react';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <header className="ui-header">
    <h1 style={{ margin: 0 }}>
      <Link
        to="/"
        style={{
          color: 'white',
          textDecoration: 'none'
        }}
      >
        {siteTitle}
      </Link>
    </h1>
  </header>
);

export default Header;
