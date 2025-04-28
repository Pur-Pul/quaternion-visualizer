import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Quaternion from "../utils/Quaternion";
import Vector3 from "../utils/Vector3";
import QuaternionView from "./QuaternionView";
import dataService from '../services/data';

const Quat = ({ setVertices }) => {
    let { index } = useParams();
    const [quaternion, setQuaternion] = useState(undefined)
    useEffect(() => {
        const fetch = async () => {
            const data = await dataService.getOne(index)
            setQuaternion(new Quaternion(data.w, data.x, data.y, data.z))
        }
        if (index!==undefined) {
            fetch()
        }
    }, [index])
    
    useEffect(() => {
        if (quaternion!==undefined) {
            const vertices = [new Vector3(0,0,0), new Vector3(0,0,1), quaternion.rotate(new Vector3(0,0,1))]
            vertices[2].selected=true
            setVertices(vertices)
        }
    }, [quaternion])
    if (quaternion===undefined) { return <>loading</> }
    
    return (
        <div>
            <br/>
            <QuaternionView quaternion={quaternion} index={index}/>
        </div>
    )
}

export default Quat;