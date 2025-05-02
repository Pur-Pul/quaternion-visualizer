import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Quaternion from "../utils/Quaternion";
import Vector3 from "../utils/Vector3";
import QuaternionView from "./QuaternionView";
import dataService from '../services/data';

const Quat = ({ setIndex }) => {
    let { index } = useParams();
    const [quaternion, setQuaternion] = useState(undefined)
    const navigate = useNavigate()
    useEffect(() => {
        const fetch = async () => {
            const data = await dataService.getOne(index)
            setQuaternion(new Quaternion(data.w, data.x, data.y, data.z))
        }
        if (index!==undefined) {
            fetch()
            setIndex(index)
        }
    }, [index])
    
    useEffect(() => {
        if (quaternion!==undefined) {
            const vertices = [new Vector3(0,0,0), new Vector3(0,0,1), quaternion.rotate(new Vector3(0,0,1))]
            vertices[2].selected=true
            //setVertices(vertices)
        }
    }, [quaternion])
    if (quaternion===undefined) { return <>loading</> }
    
    const handleCancel = () => {
        navigate("/")
    }

    return (
        <div>
            <h2>Index {index}</h2>
            <div>
                <QuaternionView quaternion={quaternion} index={index}/>
            </div>
            <input type="button" value="Go back" onClick={handleCancel}/>
            <input type="button" value="Insert rotation" onClick={() => navigate(`/insert/${index}`)}/>
        </div>
    )
}

export default Quat;