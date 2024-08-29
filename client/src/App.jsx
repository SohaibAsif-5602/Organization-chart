import React from 'react';
import './App.css';
import Chart from './components/Reactflowchart.jsx';

function App() {
  return (
    <div>
      <div style={{ borderWidth:2, borderColor: '#309e0c', borderStyle: 'solid', backgroundColor: "#FFFFFF", height: 55, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#309e0c', backgroundColor: "#ffffff", fontSize: 35, margin: 0 }}>National Assembly organization chart</h2>
      </div>
      <div><Chart /></div>
    </div>
  );
}

export default App;
