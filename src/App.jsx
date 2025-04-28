import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Quaternion from './utils/Quaternion';
import QuatList from './components/QuatList';
import Quat from './components/Quat';
import dataService from './services/data';
import Visualization from './components/Visualization';

const App = () => {
  const [vertices, setVertices] = useState([])
  const [quats, setQuats] = useState([])

  useEffect(() => {
    const loadQuats = async () => {
      const data = await dataService.getAll()
      setQuats(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
    }
    loadQuats()
  }, [])

  return (
    <BrowserRouter>
      <Visualization vertices={vertices} />
      <Routes>
        <Route path="/" element={<QuatList quaternions={quats} setVertices={setVertices}/>} />
        <Route path="quaternion/:index" element={<Quat setVertices={setVertices}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
