import React, { useState, useEffect } from 'react';

function App() {
  const [avatarError, setAvatarError] = useState(false);
  
  // Using the uploaded avatar image
  const avatarUrl = "/e9c4e804b0c546262bd2bc03f593648d.jpg";

  return (
    <div className="min-h-screen bg-[#151719] text-white flex items-center justify-center relative overflow-hidden">
      {/* Epic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#151719] via-[#3f4b48] to-[#151719]"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#a9afb2] rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#7d8181] rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-[#d0d4d7] rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#a9afb2] rounded-full animate-ping opacity-80"></div>
        
        {/* Epic Glow Effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7d8181]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#a9afb2]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#d0d4d7]/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Profile Image */}
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto mb-8 relative">
            <div className="w-full h-full bg-gradient-to-r from-[#7d8181] via-[#a9afb2] to-[#d0d4d7] rounded-full p-2 animate-pulse">
              <div className="w-full h-full bg-[#151719] rounded-full flex items-center justify-center overflow-hidden relative">
                {/* Avatar Image */}
                {!avatarError ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onLoad={() => {
                      setAvatarError(false);
                    }}
                    onError={() => {
                      setAvatarError(true);
                    }}
                  />
                ) : (
                  /* Fallback */
                  <div className="w-full h-full bg-gradient-to-br from-[#3f4b48] to-[#7d8181] rounded-full flex items-center justify-center">
                    <span className="text-6xl font-black text-[#a9afb2]">L</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 bg-[#151719] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Discord Username */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] via-[#d0d4d7] to-[#a9afb2] mb-4 drop-shadow-2xl animate-pulse">
            1c
          </h1>
          <p className="text-lg text-[#7d8181] opacity-80">
            Discord Username
          </p>
        </div>
      </div>

      {/* Epic Border Effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7d8181] to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a9afb2] to-transparent animate-pulse delay-500"></div>
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d0d4d7] to-transparent animate-pulse delay-1000"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#7d8181] to-transparent animate-pulse delay-1500"></div>
    </div>
  );
}

export default App;