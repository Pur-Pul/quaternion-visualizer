import { useState, useEffect } from "react";
import '../styles/QuatForm.css'
import Quaternion from "../utils/Quaternion";
import dataService from "../services/data"
import { useNavigate, useParams } from "react-router-dom";
import Vector3 from "../utils/Vector3";

const QuatForm = ({
    newQuat, 
    setNewQuat,
    slerpN,
    setSlerpN,
    selection,
    setSelection,
    rotStart,
    setRotStart,
    rotEnd,
    setRotEnd,
    setIndex,
    index,
    quaternions,
    setQuaternions
    }) => {
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        setRotStart(new Vector3(0,0,0))
        setRotEnd(new Vector3(0,0,0))
        setNewQuat(new Quaternion())
        setSlerpN(0)
    }, [])

    useEffect(() => {
        setIndex(Number(index))
    }, [params.index])

    const handleQuat = (e) => {
        switch (e.target.id) {
            case "w":
                setNewQuat(new Quaternion(Number(e.target.value), newQuat.x, newQuat.y, newQuat.z));
                break;
            case "x":
                setNewQuat(new Quaternion(newQuat.w, Number(e.target.value), newQuat.y, newQuat.z));
                break;
            case "y":
                setNewQuat(new Quaternion(newQuat.w, newQuat.x, Number(e.target.value), newQuat.z));
                break;
            case "z":
                setNewQuat(new Quaternion(newQuat.w, newQuat.x, newQuat.y, Number(e.target.value)));
                break;
            default:
                console.log(`Invalid component ${e.target.id}`)
        }
    }

    const submitQuatHandler = async (e) => {
        e.preventDefault()
        let baseQuat = new Quaternion(1,0,0,0)
        if (index >= 0) {
            const data = await dataService.getOne(index)
            baseQuat = new Quaternion(data.w, data.x, data.y, data.z)
        }
        const newQuats = []
        for (var i = 0; i < slerpN; i++) {
            const quat = new Quaternion(1,0,0,0).slerp(newQuat, (i+1)/(slerpN+1))
            newQuats.push(quat.mult(baseQuat))
        }
        newQuats.push(newQuat.mult(baseQuat))
        const response = await dataService.post(newQuats, index==null ? -1 : index)
        console.log(response)
        const new_quats = response.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z))
        setQuaternions(quaternions.slice(0,index+1).concat(new_quats).concat(quaternions.slice(index+1, quaternions.length)))

        setRotStart(new Vector3(0,0,0))
        setRotEnd(new Vector3(0,0,0))
        setNewQuat(new Quaternion())
        setSlerpN(0)
        navigate('/')
    }

    const handleRotPoint = (e) => {
        switch (e.target.id) {
            case "start_x":
                setRotStart(new Vector3(e.target.value, rotStart.y, rotStart.z));
                break;
            case "start_y":
                setRotStart(new Vector3(rotStart.x, e.target.value, rotStart.z));
                break;
            case "start_z":
                setRotStart(new Vector3(rotStart.x, rotStart.y, e.target.value));
                break;
            case "end_x":
                setRotEnd(new Vector3(e.target.value, rotEnd.y, rotEnd.z));
                break;
            case "end_y":
                setRotEnd(new Vector3(rotEnd.x, e.target.value, rotEnd.z));
                break;
            case "end_z":
                setRotEnd(new Vector3(rotEnd.x, rotEnd.y, e.target.value));
                break;
            default:
                console.log(`Invalid component ${e.target.id}`)
        }
    }

    const handleCancel = () => {
        setRotStart(new Vector3(0,0,0))
        setRotEnd(new Vector3(0,0,0))
        setNewQuat(new Quaternion())
        setSlerpN(0)
        navigate("/")
    }

    return (
        <div>
            <h2>Insert rotation after index {index}</h2>
            <form onSubmit={submitQuatHandler}>
                <p>
                    <label>Rotation start:</label>
                    <input onChange={handleRotPoint} value={rotStart.x} className="comp" step="any" min="-1" max="1" id="start_x" name="start_x" type="number"/>
                    <input onChange={handleRotPoint} value={rotStart.y} className="comp" step="any" min="-1" max="1" id="start_y" name="start_y" type="number"/>
                    <input onChange={handleRotPoint} value={rotStart.z} className="comp" step="any" min="-1" max="1" id="start_z" name="start_z" type="number"/>
                    {
                        selection==0 ? 
                        <input type="button" value="Stop selection" onClick={()=>setSelection(-1)}/> : 
                        <input type="button" value="Select from plot" onClick={()=>setSelection(0)}/>
                    }
                </p>
                <p>
                    <label>Rotation end:</label>
                    <input onChange={handleRotPoint} value={rotEnd.x} className="comp" step="any" min="-1" max="1" id="end_x" name="end_x" type="number"/>
                    <input onChange={handleRotPoint} value={rotEnd.y} className="comp" step="any" min="-1" max="1" id="end_y" name="end_y" type="number"/>
                    <input onChange={handleRotPoint} value={rotEnd.z} className="comp" step="any" min="-1" max="1" id="end_z" name="end_z" type="number"/>
                    {
                        selection==1 ? 
                        <input type="button" value="Stop selection" onClick={()=>setSelection(-1)}/> : 
                        <input type="button" value="Select from plot" onClick={()=>setSelection(1)}/>
                    }
                </p>
                <p>
                    

                    <label>Quaternion:</label>
                    <input value={newQuat.w} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="w" name="quat_w" type="number"/>
                    <input value={newQuat.x} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="x" name="quat_x" type="number"/>
                    <input value={newQuat.y} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="y" name="quat_y" type="number"/>
                    <input value={newQuat.z} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="z" name="quat_z" type="number"/>
                </p>
                <p>
                    <label>Interpolated quaternions: </label>
                    <input value={slerpN} onChange={(e) => setSlerpN(Number(e.target.value))} className="comp" min="0" type="number"/>
                </p>
                <p>
                    <input type="submit" value="Insert"/>
                    <input type="button" value="cancel" onClick={handleCancel}/>
                </p>
            </form>
            
        </div>
    );
};

export default QuatForm