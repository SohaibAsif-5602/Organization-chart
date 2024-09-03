import React,{useState} from 'react';
import './App.css';
import Chart from './components/Reactflowchart.jsx';
import Header from './components/Header.jsx';

function App() {
  const [filter,setFilter] =useState('');
  return (
    
    <div>
   <Header setFilter={setFilter} />
      <div><Chart filter={filter} /></div>
    </div>
  );
}

export default App;



