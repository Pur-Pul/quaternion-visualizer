import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Quaternion from './utils/Quaternion';
import QuatList from './components/quatList';
import Quat from './components/Quat';
import dataService from './services/data';

const App = () => {
  const [data, setData] = useState([])
  const [range, setRange] = useState([0,0])

  useEffect(() => {
    const loadData = async () => {
      const data = await dataService.getAll()
      setData(data)
    }
    loadData()
  }, [])

  const quats = data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuatList quaternions={quats}/>} />
        <Route path="quaternion/:index" element={<Quat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
