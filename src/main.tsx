import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css"
import HomePage from './App'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage />
     <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
  </StrictMode>,
)
