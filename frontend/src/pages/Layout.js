import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>
        <h1>Skill Sharing Platform</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2023 Skill Sharing Platform</p>
      </footer>
    </div>
  );
};

export default Layout;