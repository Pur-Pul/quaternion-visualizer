import QuaternionView from "./QuaternionView";
import Vector3 from "../utils/Vector3";
import Polygon from "../utils/Polygon";
import Visualization from "./Visualization";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";

const QuatList = ({ quaternions }) => {
    const [range, setRange] = useState([0,1000])
    const [dataStop, setDataStop] = useState(1000)
    const [dataStart, setDataStart] = useState(0)
    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setRange([Math.max(range[0], dataStart), Math.min(range[1], dataStop)])
      
    }, [dataStart, dataStop])

    const quats = quaternions.slice(range[0], range[1])

    const origin = new Vector3(0,0,1);
    let vertices = [ new Vector3(0,0,0) ];
    quats.forEach((quat, index) => {
        const new_vertex = quat.rotate(origin)
        vertices.push(new_vertex)
    });

    useEffect(() => {
        document.body.addEventListener('click', (event) => {
            const index = event.target.getAttribute("index")
            setSelected(index)
            
        });
    }, []);

    useEffect(() => {
        console.log(vertices)
        if (selected && selected > 0) { 
            vertices[selected-1].selected = true
            vertices[selected].selected = true
        }
    }, [selected])

    console.log(selected)

    return (
        <div>
            <Visualization vertices={vertices} />
            <input type="number" value={dataStart} onChange={(e) => setDataStart(Math.max(0, e.target.value))}/>
            <input type="number" value={dataStop} onChange={(e) => setDataStop(Math.max(0, e.target.value))}/>
            <RangeSlider defaultValue={range} min={dataStart} max={dataStop} onInput={(val) => setRange(val)}/>
            <h2>Quaternions</h2>
            <ol start={range[0]}>
                {quats.map((quaternion, index) => {
                    return(
                        <li key={range[0]+index}>

                                <QuaternionView onClick={()=>console.log('click')} quaternion={quaternion} index={range[0]+index}/>
                                <button onClick={() => navigate(`/quaternion/${range[0]+index}`)}>Open</button>
            
                        </li>
                    )
                })}
            </ol>
        </div>
    );
};

export default QuatList;