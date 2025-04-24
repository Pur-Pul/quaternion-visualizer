import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Quaternion from "../utils/Quaternion";
import Vector3 from "../utils/Vector3";
import Polygon from "../utils/Polygon";
import QuaternionView from "./QuaternionView";
import Visualization from "./Visualization";
import dataService from '../services/data';

const Quat = () => {
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
    
    if (quaternion===undefined) { return <>loading</> }
    const vertices = [new Vector3(0,0,0), new Vector3(0,0,1), quaternion.rotate(new Vector3(0,0,1))]
    vertices.forEach((vertex) => vertex.selected=true)
    console.log(vertices)
    return (
        <div>
            <Visualization vertices={vertices}/>
            <br/>
            <QuaternionView quaternion={quaternion} index={index}/>
        </div>
    )
}

export default Quat;