import React from 'react'
import { useNavigate } from 'react-router-dom';

  

  function Header({ setFilter }) {
    const navigate = useNavigate();

    return (
      <div style={{ borderColor: '#309e0c', borderStyle: 'solid', backgroundColor: "#E6FFE2", paddingLeft: 300, height: 70, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#309e0c', backgroundColor: "#E6FFE2", fontSize: 35, margin: 0 }}>National Assembly organization chart</h2>
        <select
          onChange={(e) => setFilter(e.target.value)}
          style={{
            height: 40,
            borderRadius: 5,
            border: '1px solid #309e0c',
            marginLeft: 180,
            fontSize: 16,
            backgroundColor: "#309e0c",
            color: '#E6FFE2'
          }}
        >
          <option value="">All</option>
          <option value="IT Branch">IT</option>
          <option value="Admin">Admin</option>
          <option value="Legislation">Legislation</option>
        </select>
        <button
          style={{
            height: 40,
            borderRadius: 5,
            border: '1px solid #309e0c',
            marginLeft: 20,
            fontSize: 16,
            backgroundColor: "#309e0c",
            color: '#E6FFE2',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/admin')}
        >
          Admin Panel
        </button>
      </div>
    );
  }


export default Header