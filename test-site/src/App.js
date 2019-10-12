import React, {useState} from 'react';
import './App.css';
import TimeInput from '../../index'

function App() {
  const [value, setValue] = useState('20:30')
  const [test, setTest] = useState(value)
  return (
    <div className="App">
      <label style={{marginTop: '2em', display: 'block'}}>
        <span style={{marginRight: '0.5em'}}>Time input</span>
        <TimeInput value={value} onChange={({value}) => setTest(value)} />
      </label>

      <p>
        <button onClick={()=>setValue('07:15')}>Set time to 7:15 AM</button>
        <button onClick={()=>setValue('15:45')}>Set time to 3:45 PM</button>
      </p>
      <p>Test: {test}</p>
    </div>
  );
}

export default App;
