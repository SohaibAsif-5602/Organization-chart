import React from 'react';

const BPS_SCALE_1 = [
  { BPS: 21, color: "#FF66B2" },
  { BPS: 20, color: '#FF66FF' },
  { BPS: 19, color: '#3399FF' },
  { BPS: 18, color: '#C0C0C0' },
  { BPS: 17, color: '#FFFF44' },
  { BPS: 16, color: '#B2FF44' },
  { BPS: 15, color: '#FFB244' },
  { BPS: 14, color: '#66B2FF' },
  { BPS: 13, color: '#FF6666' },
  { BPS: 12, color: '#66FF66' },
  { BPS: 11, color: '#FFCC66' },

];

const BPS_SCALE_2 = [
  { BPS: 10, color: '#FF99FF' },
  { BPS: 9, color: '#66FFCC' },
  { BPS: 8, color: '#FF9966' },
  { BPS: 7, color: '#99FF99' },
  { BPS: 6, color: '#FF6666' },
  { BPS: 5, color: '#66CCFF' },
  { BPS: 4, color: '#FFCCCC' },
  { BPS: 3, color: '#CCFF66' },
  { BPS: 2, color: '#FFCC99' },
  { BPS: 1, color: '#FF99CC' },
  {BPS:"Other",color:'#FF474C'}
];

const BPSScaleChart = () => (
  
  <div style={{
    padding: '3px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.8em',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    width: '200px', 
    position: 'absolute',
    right: '0',
    marginTop: '76px',
    top: '0',
    color: '#309e0c',
    backgroundColor: '#E6FFE2'
  }}>
    <div style={{marginLeft:'10px',}}><h2>BPS SCALE CHART</h2></div>
    <div  style={{    display: 'flex',
}}>
    <div style={{ flex: 1, marginRight: '10px' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {BPS_SCALE_1.map(({ BPS, color }) => (
          <li key={BPS} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{
              width: '15px',
              height: '15px',
              backgroundColor: color,
              borderRadius: '3px',
              marginRight: '10px',
            }}></div>
            BPS {BPS}
          </li>
        ))}
      </ul>
    </div>
    <div style={{ flex: 1 }}>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {BPS_SCALE_2.map(({ BPS, color }) => (
          <li key={BPS} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{
              width: '15px',
              height: '15px',
              backgroundColor: color,
              borderRadius: '3px',
              marginRight: '10px',
            }}></div>
            BPS {BPS}
          </li>
        ))}
      </ul>
    </div>
    </div>
  </div>
);

export default BPSScaleChart;
