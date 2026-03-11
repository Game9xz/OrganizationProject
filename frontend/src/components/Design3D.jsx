import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Design3D() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        height: '60px', 
        backgroundColor: '#18181b', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 20px',
        color: 'white',
        borderBottom: '1px solid #333'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            backgroundColor: '#3f3f46', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '20px'
          }}>
          &larr; กลับ
        </button>
        <h2 style={{ margin: 0, fontSize: '18px' }}>ระบบออกแบบ 3D</h2>
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src={`/3d-design/design.html?apiUrl=${encodeURIComponent(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
          title="3D Design Application"
        />
      </div>
    </div>
  );
}
