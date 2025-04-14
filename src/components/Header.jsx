import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <header className="relative flex justify-center items-center h-16 border-b border-gray-200">
      <button 
        onClick={goBack} 
        className="absolute left-10 top-1/2 transform -translate-y-1/2"
        aria-label="Go back"
      >
        <div className="w-6 h-6">
          <svg 
            width="18.41" 
            height="14.71" 
            viewBox="0 0 18.41 14.71" 
            fill="#111111"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.41 6.71H4.41L8.71 2.41C9.1 2.02 9.1 1.39 8.71 1C8.32 0.61 7.69 0.61 7.3 1L1.71 6.59C1.32 6.98 1.32 7.61 1.71 8L7.3 13.59C7.69 13.98 8.32 13.98 8.71 13.59C9.1 13.2 9.1 12.57 8.71 12.18L4.41 7.88H17.41C17.95 7.88 18.41 7.42 18.41 6.88C18.41 6.34 17.95 5.88 17.41 5.88V6.71Z"/>
          </svg>
        </div>
      </button>
      <h1 className="text-lg font-bold text-[#111111]">
        {window.location.pathname.includes('record') && 'Record'}
        {window.location.pathname.includes('feedback') && 'Feedback'}
        {window.location.pathname.includes('grammar-feedback') && 'Grammar Feedback'}
        {window.location.pathname.includes('practice') && 'Practice'}
        {window.location.pathname.includes('score') && 'Practice'}
      </h1>
    </header>
  );
}

export default Header;