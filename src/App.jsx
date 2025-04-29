import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Quaternion from './utils/Quaternion';
import QuatList from './components/QuatList';
import Quat from './components/Quat';
import dataService from './services/data';
import Visualization from './components/Visualization';
import Vector3 from './utils/Vector3';

const App = () => {
  const [vertices, setVertices] = useState([])
  const [quats, setQuats] = useState([])
  const [point, setPoint] = useState(new Vector3(0,0,1))
  const [selection, setSelection] = useState(false)

  useEffect(() => {
    const loadQuats = async () => {
      const data = await dataService.getAll()
      setQuats(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
    }
    loadQuats()
  }, [])

  return (
    <BrowserRouter>
      <Visualization vertices={vertices} point={point} setPoint={setPoint} selection={selection}/>
      <Routes>
        <Route path="/" element={<QuatList quaternions={quats} setVertices={setVertices} point={point} setPoint={setPoint} selection={selection} setSelection={setSelection}/>} />
        <Route path="quaternion/:index" element={<Quat setVertices={setVertices}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
