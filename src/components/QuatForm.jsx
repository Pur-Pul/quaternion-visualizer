import { useState, useEffect } from "react";
import '../styles/QuatForm.css'
import Quaternion from "../utils/Quaternion";
import dataService from "../services/data"
import { useNavigate } from "react-router-dom";

const QuatForm = ({newQuat, setNewQuat, slerpN, setSlerpN, selection, setSelection, reference, newRef, setNewRef, range, quats, setQuats}) => {
    const [index, setIndex] = useState(range[1])
    const [useIndex, setUseIndex] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (index > range[1]) { setIndex(range[1]) }
    }, [range])

    useEffect(() => {
        const updateNewRef = async () => {
            if (useIndex) {
                const result = await dataService.getOne(index)
                setNewRef(new Quaternion(result.w, result.x, result.y, result.z).rotate(reference))
            } else {
                setNewRef(null)
            }
        }
        updateNewRef()
        
    }, [useIndex, reference, index])

    const handleQuat = (e) => {
        switch (e.target.id) {
            case "w":
                setNewQuat(new Quaternion(e.target.value, newQuat.x, newQuat.y, newQuat.z));
                break;
            case "x":
                setNewQuat(new Quaternion(newQuat.w, e.target.value, newQuat.y, newQuat.z));
                break;
            case "y":
                setNewQuat(new Quaternion(newQuat.w, newQuat.x, e.target.value, newQuat.z));
                break;
            case "z":
                setNewQuat(new Quaternion(newQuat.w, newQuat.x, newQuat.y, e.target.value));
                break;
            default:
                console.log(`Invalid component ${e.target.id}`)
        }
    }

    const submitQuatHandler = async (e) => {
        let baseQuat = new Quaternion(1,0,0,0)
        if (index >= 0) {
            const data = await dataService.getOne(index)
            baseQuat = new Quaternion(data.w, data.x, data.y, data.z)
            }
        const newQuats = []
        console.log(slerpN)
        for (var i = 0; i < slerpN; i++) {
            newQuats.push(baseQuat.slerp(newQuat, (i+1)/(slerpN+1)))
        }
        newQuats.push(newQuat)
        const response = await dataService.post(newQuats, index==null ? -1 : index)
        console.log(response)
        navigate('/')
    }

    return (
        <div>
            <form onSubmit={submitQuatHandler}>
                <p>
                    <label htmlFor="new_index">After index:</label>
                    <input className="comp" name="new_index" type="number" min="-1" value={index} onChange={(e) => setIndex(Number(e.target.value))}/>
                </p>
                <p>
                    <label htmlFor="useref">Use index as reference:</label>
                    <input checked={useIndex} onChange={(e) => setUseIndex(e.target.checked)} name="useref" type="checkbox"/>
                </p>
                <p>
                    <label>Quaternion:</label>
                    <input value={newQuat ? newQuat.w : 1} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="w" name="quat_w" type="number"/>
                    <input value={newQuat ? newQuat.x : 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="x" name="quat_x" type="number"/>
                    <input value={newQuat ? newQuat.y : 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="y" name="quat_y" type="number"/>
                    <input value={newQuat ? newQuat.z : 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="z" name="quat_z" type="number"/>
                    {
                        selection ? 
                        <input type="button" value="Stop selection" onClick={()=>setSelection(false)}/> : 
                        <input type="button" value="Select from plot" onClick={()=>setSelection(true)}/>
                    }
                </p>
                <p>
                    <label>Interpolated quaternions: </label>
                    <input value={slerpN} onChange={(e) => setSlerpN(Number(e.target.value))} className="comp" min="0" type="number"/>
                </p>
                <input type="submit" value="Insert"/>
            </form>
        </div>
    );
};

export default QuatForm