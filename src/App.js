import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Pages/Login';
import LandingPage from './Pages/LandingPage';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = useState(null);
  const [pDFFile, setPDFFile] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} />
      {token ? <LandingPage pDFFile={pDFFile}/> : <Login setToken={setToken} setPDFFile={setPDFFile} />}
    </QueryClientProvider>
  );
}

export default App;
