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
import RangeSlider from 'react-range-slider-input';

const Insert = ({N}) => {
  const [val, setVal] = useState(N-1)
  const navigate = useNavigate()
  const handleIndex = (e) => {
    e.preventDefault()
    console.log()
    const index = Number(e.target.index.value)
    navigate(`/insert/${index}`)
  }

  useEffect(() => {
    setVal(N-1)
  },[N])

  return (
    <form onSubmit={handleIndex}>
      <input value="Insert new" type="submit" />
      <label>after index: </label>
      <input value={val} onChange={(e) => setVal(e.target.value)} name="index" type="number" min="0" max={N-1} />
    </form>
  )
}

const App = () => {
  const [quaternions, setQuaternions] = useState([])
  const [newQuat, setNewQuat] = useState(new Quaternion())
  const [slerpN, setSlerpN] = useState(0)
  const [selection, setSelection] = useState(-1)
  const [reference, setReference] = useState({x:new Vector3(1,0,0),y:new Vector3(0,1,0),z:new Vector3(0,0,1)})
  const [newRef, setNewRef] = useState(null)
  const [range, setRange] = useState([0,1000])
  const [dataStop, setDataStop] = useState(1000)
  const [dataStart, setDataStart] = useState(0)
  const [selected, setSelected] = useState(null)
  const [rotStart, setRotStart] = useState(new Vector3(0,0,0))
  const [rotEnd, setRotEnd] = useState(new Vector3(0,0,0))
  const [index, setIndex] = useState(null)

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
  }, [quaternions])

  useEffect(() => {
    setRange([Math.max(range[0], dataStart), Math.min(range[1], dataStop)])
  }, [dataStart, dataStop])

  const quats = quaternions.slice(range[0], range[1]+1)
  
  const handleReset = async (e) => {
    const data = await dataService.reset()
    setQuaternions(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
  }

  const handleZero = async () => {
    const data = await dataService.zero()
    setQuaternions(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
  }

  return (
    <BrowserRouter>
      <Visualization
        selection={selection}
        slerpN={slerpN}
        newQuat={newQuat}
        setNewQuat={setNewQuat}
        reference={reference}
        newRef={newRef}
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
            <div id="range_selector">
              <input className="range" type="number" value={dataStart} onChange={(e) => setDataStart(Math.max(0, e.target.value))}/>
              <RangeSlider defaultValue={range} min={dataStart} max={dataStop} onInput={(val) => setRange(val)}/>
              <input className="range" type="number" value={dataStop} onChange={(e) => setDataStop(Math.max(0, e.target.value))}/>
            </div>
            <div style={{display: "flex"}}>
              <div>
                <input type="button" value="reset" onClick={handleReset}/>
                <input type="button" value="zero" onClick={handleZero}/>
              </div>
              <Insert N={range[1]+1}/>
            </div>
            <div style={{display: "flex"}}>
              <QuatList 
                quaternions={quats}
                range={range}
                setRange={setRange}
                dataStart={dataStart}
                setDataStart={setDataStart}
                dataStop={dataStop}
                setDataStop={setDataStop}
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
                reference={reference}
                newRef={newRef}
                setNewRef={setNewRef}
                range={range}
                quats={quaternions}
                setQuats={setQuaternions}
                rotStart={rotStart}
                setRotStart={setRotStart}
                rotEnd={rotEnd}
                setRotEnd={setRotEnd}
                setIndex={setIndex}
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
