'use client';
import { useState } from 'react';

export default function HomePage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim()) {
      setMessage('Tanpri ranpli tout chan yo.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Imèl la ak fichye Excel la voye byen!');
        setFullName('');
        setEmail('');
      } else {
        setMessage('❌ Erè: ' + (data.error || 'Yon bagay pa mache'));
      }
    } catch (error) {
      setMessage('❌ Erè rezo a.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: '30px', fontFamily: 'Arial, sans-serif', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📧 Resevwa Fichye Excel pa Imèl</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Ranpli fòmilè a pou w resevwa yon fichye Excel ak enfòmasyon w yo.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            Non konplè:
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Antre non w ak siyati w"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: 25 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            Imèl:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="egzanp@imel.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
        >
          {isLoading ? '⏳ Voye a pran 3 segonn...' : '🚀 Voye Fichye a'}
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: 20, 
          padding: '12px', 
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}