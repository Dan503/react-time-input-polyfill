import React from 'react';
import './App.css';
import TimeInput from '../index'

function App() {
  return (
    <div className="App">
      <label>
        <span>Time input</span>
        <TimeInput onChange={x => console.log(x)} />
      </label>
    </div>
  );
}

export default App;
