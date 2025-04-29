import { useEffect, useState } from "react";
import '../styles/QuatForm.css'
import Vector3 from "../utils/Vector3";
import Quaternion from "../utils/Quaternion";
import dataService from "../services/data"

const QuatForm = ({point, setPoint, selection, setSelection}) => {
    const [index, setIndex] = useState(null);
    const [quat, setQuat] = useState(null)
    const reference = new Vector3(0,0,1)
    useEffect(() => {
        if (point) {
            const axis = reference.cross(point).normalize()
            const angle = point.angle(reference)
            setQuat(Quaternion.axisAngle(axis, angle))
        }
    }, [point])

    const handleQuat = (e) => {
        switch (e.target.id) {
            case "w":
                setQuat(new Quaternion(e.target.value, quat.x, quat.y, quat.z));
                break;
            case "x":
                setQuat(new Quaternion(quat.w, e.target.value, quat.y, quat.z));
                break;
            case "y":
                setQuat(new Quaternion(quat.w, quat.x, e.target.value, quat.z));
                break;
            case "z":
                setQuat(new Quaternion(quat.w, quat.x, quat.y, e.target.value));
                break;
            default:
                console.log(`Invalid component ${e.target.id}`)
        }
        //setPoint(quat.rotate(reference))
        
    }

    const submitQuatHandler = async (e) => {
        e.preventDefault()
        const response = await dataService.post(quat, index ? index : -1)
        console.log(response)
    }

    return (
        <div>
            <form onSubmit={submitQuatHandler}>
                <p>
                    <label htmlFor="new_index">Index:</label>
                    <input className="comp" name="new_index" type="number" min="0" onChange={(e) => setIndex(e.target.value)}/>
                </p>
                <p>
                    <label>Quaternion:</label>
                    <input value={quat ? quat.w : 1} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="w" name="quat_w" type="number"/>
                    <input value={quat ? quat.x: 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="x" name="quat_x" type="number"/>
                    <input value={quat ? quat.y : 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="y" name="quat_y" type="number"/>
                    <input value={quat ? quat.z : 0} onChange={handleQuat} className="comp" step="any" min="-1" max="1" id="z" name="quat_z" type="number"/>
                    {
                        selection ? 
                        <input type="button" value="Stop selection" onClick={()=>setSelection(false)}/> : 
                        <input type="button" value="Select from plot" onClick={()=>setSelection(true)}/>
                    }
                    
                </p>
                <input type="submit" value="Insert"/>
            </form>
        </div>
    );
};

export default QuatForm