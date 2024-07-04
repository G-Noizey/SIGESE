import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import LoginAdmin from '../components/Admin/LoginAdmin';

function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginAdmin />} />
        
        </Routes>
      </BrowserRouter>
    )
  }
  
  export default AppRouter;