import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Quaternion from './utils/Quaternion';
import QuatList from './components/QuatList';
import Quat from './components/Quat';
import dataService from './services/data';
import Visualization from './components/Visualization';
import Vector3 from './utils/Vector3';
import QuatForm from './components/QuatForm';

const App = () => {
  const [vertices, setVertices] = useState([])
  const [quats, setQuats] = useState([])
  const [newQuat, setNewQuat] = useState(new Quaternion())
  const [slerpN, setSlerpN] = useState(0)
  const [selection, setSelection] = useState(false)
  const [reference, setReference] = useState(new Vector3(0,0,1))
  const [newRef, setNewRef] = useState(null)
  const [range, setRange] = useState([0,1000])
  const [dataStop, setDataStop] = useState(1000)
  const [dataStart, setDataStart] = useState(0)

  useEffect(() => {
    const loadQuats = async () => {
      const data = await dataService.getAll()
      setQuats(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
    }
    loadQuats()
  }, [])

  return (
    <BrowserRouter>
      <Visualization
        vertices={vertices}
        selection={selection}
        slerpN={slerpN}
        newQuat={newQuat}
        setNewQuat={setNewQuat}
        reference={reference}
        newRef={newRef}
      />
      <Routes>
        <Route path="/" element={
          <div style={{display: "flex"}}>
            <QuatList 
              quaternions={quats}
              setVertices={setVertices}
              reference={reference}
              setReference={setReference}
              range={range}
              setRange={setRange}
              dataStart={dataStart}
              setDataStart={setDataStart}
              dataStop={dataStop}
              setDataStop={setDataStop}
            />
            <div>
              <h2>Insert rotation</h2>
              <QuatForm
                  newQuat={newQuat}
                  setNewQuat={setNewQuat}
                  slerpN={slerpN}
                  setSlerpN={setSlerpN}
                  selection={selection}
                  setSelection={setSelection}
                  reference={reference}
                  newRef={newRef}
                  setNewRef={setNewRef}
                  range={range}
                  quats={quats}
                  setQuats={setQuats}
              />
            </div>
          </div>
        } />
        <Route path="quaternion/:index" element={<Quat setVertices={setVertices}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
