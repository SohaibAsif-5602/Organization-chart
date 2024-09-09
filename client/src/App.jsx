import React,{useState} from 'react';
import './App.css';
import Chart from './components/Reactflowchart.jsx';
import Header from './components/Header.jsx';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  const [filter,setFilter] =useState('');
  return (
    <ReactFlowProvider>    <div>
   <Header setFilter={setFilter} />
      <div><Chart filter={filter} /></div>
    </div>
    </ReactFlowProvider>

  );
}

export default App;



