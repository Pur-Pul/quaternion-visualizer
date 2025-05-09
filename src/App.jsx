import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom'
import Quaternion from './utils/Quaternion';
import QuatList from './components/QuatList';
import Quat from './components/Quat';
import dataService from './services/data';
import Visualization from './components/Visualization';
import Vector3 from './utils/Vector3';
import QuatForm from './components/QuatForm';
import RangeSelector from './components/RangeSelector';
import ControlPanel from './components/ControlPanel';

const App = () => {
  const [quaternions, setQuaternions] = useState([])
  const [newQuat, setNewQuat] = useState(new Quaternion())
  const [slerpN, setSlerpN] = useState(0)
  const [selection, setSelection] = useState(-1)
  const [reference, setReference] = useState({x:new Vector3(1,0,0),y:new Vector3(0,1,0),z:new Vector3(0,0,1)})
  const [range, setRange] = useState([0,1000])
  const [dataStop, setDataStop] = useState(1000)
  const [dataStart, setDataStart] = useState(0)
  const [selected, setSelected] = useState(null)
  const [rotStart, setRotStart] = useState(new Vector3(0,0,0))
  const [rotEnd, setRotEnd] = useState(new Vector3(0,0,0))
  const [index, setIndex] = useState(null)
  const [quats, setQuats] = useState([])

  useEffect(() => {
    if (rotStart && rotEnd && new Vector3(0,0,0).dist(rotStart) != 0 && new Vector3(0,0,0).dist(rotEnd) != 0) {
      const axis = rotStart.cross(rotEnd).normalize()
      const angle = rotEnd.angle(rotStart)
      setNewQuat(Quaternion.axisAngle(axis, angle))
    }
  }, [rotStart, rotEnd])

  useEffect(() => {
    const loadQuats = async () => {
      const data = await dataService.getAll()
      setQuaternions(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
    }
    loadQuats()
  }, [])

  useEffect(() => {
    if(quaternions.length == 0) {
      setQuaternions([new Quaternion(1,0,0,0)])
    }
    setDataStop(quaternions.length-1)
  }, [quaternions])

  useEffect(() => {
    setRange([Number(dataStart), Number(dataStop)])
  }, [dataStart, dataStop])

  useEffect(() => {
    setQuats(quaternions.slice(range[0], range[1]+1))
  }, [quaternions, range])
  return (
    <BrowserRouter>
      <Visualization
        selection={selection}
        slerpN={slerpN}
        newQuat={newQuat}
        setNewQuat={setNewQuat}
        reference={reference}
        quats={quats}
        start={range[0]}
        selected={selected}
        rotStart={rotStart}
        rotEnd={rotEnd}
        setPoint={[setRotStart, setRotEnd]}
        index={index}
        setSelection={setSelection}
      />
      <Routes>
        <Route path="/" element={
          <div>
            <RangeSelector dataStart={dataStart} setDataStart={setDataStart} range={range} setRange={setRange} dataStop={dataStop} setDataStop={setDataStop}/>
            <ControlPanel range={range} setQuaternions={setQuaternions}/>
            <div style={{display: "flex"}}>
              <QuatList 
                quaternions={quats}
                range={range}
                setSelected={setSelected}
                setIndex={setIndex}
              />
            </div>
          </div>
        } />
        <Route path="/insert/:index" element={
          <div>
            <QuatForm
                newQuat={newQuat}
                setNewQuat={setNewQuat}
                slerpN={slerpN}
                setSlerpN={setSlerpN}
                selection={selection}
                setSelection={setSelection}
                range={range}
                rotStart={rotStart}
                setRotStart={setRotStart}
                rotEnd={rotEnd}
                setRotEnd={setRotEnd}
                setIndex={setIndex}
                index={index}
                quaternions={quaternions}
                setQuaternions={setQuaternions}
            />
          </div>
        } />
        <Route path="/quaternion/:index" element={<Quat setIndex={setIndex}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
