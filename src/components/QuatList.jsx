import QuaternionView from "./QuaternionView";
import Vector3 from "../utils/Vector3";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import '../styles/QuatList.css'
import QuatForm from "./QuatForm";

const QuatList = ({
    quaternions,
    setVertices,
    reference,
    setReference,
    range,
    setRange,
    dataStart,
    setDataStart,
    dataStop,
    setDataStop
    }) => {

    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setRange([Math.max(range[0], dataStart), Math.min(range[1], dataStop)])
    }, [dataStart, dataStop])

    const quats = quaternions.slice(range[0], range[1]+1)
    const origin = new Vector3(0,0,0);
    useEffect(() => {
        const vertices = [ origin, reference ];
        quats.forEach((quat, index) => {
            let new_vertex = quat.rotate(reference)
            new_vertex.selected = range[0]+index == selected
            vertices.push(new_vertex)
        });
        setVertices(vertices)
    }, [quaternions, range, selected, reference])
    const quatHoverHandler = (event) => {
        const index = event.target.getAttribute("index")
        setSelected(index)
    }

    const handleReference = (e) => {
        switch (e.target.id) {
            case "x":
                setReference(new Vector3(e.target.value, reference.y, reference.z));
                break;
            case "y":
                setReference(new Vector3(reference.x, e.target.value, reference.z));
                break;
            case "z":
                setReference(new Vector3(reference.x, reference.y, e.target.value));
                break;
            default:
                console.log(`Invalid component ${e.target.id}`)
        }
    }

    return (
        <div>
            <div id="range_selector">
                <input className="range" type="number" value={dataStart} onChange={(e) => setDataStart(Math.max(0, e.target.value))}/>
                <RangeSlider defaultValue={range} min={dataStart} max={dataStop} onInput={(val) => setRange(val)}/>
                <input className="range" type="number" value={dataStop} onChange={(e) => setDataStop(Math.max(0, e.target.value))}/>
                
            </div>
            <div id="reference">
                <label className="cell">Reference point:</label>
                <input className="cell" id="x" value={reference.x} min={-1} max={1} onChange={handleReference}/>
                <input className="cell" id="y" value={reference.y} min={-1} max={1} onChange={handleReference}/>
                <input className="cell" id="z" value={reference.z} min={-1} max={1} onChange={handleReference}/>
            </div>
            <div id="list_container">
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Quaternion</th>
                        </tr>
                    </thead>
                    <tbody>
                    {quats.map((quaternion, index) => {
                        return(
                            <tr key={range[0]+index}>
                                <td>
                                    {range[0]+index}
                                </td>
                                <td id="quaternion" onMouseOver={quatHoverHandler} onClick={() => navigate(`/quaternion/${range[0]+index}`)}>
                                    <QuaternionView quaternion={quaternion} index={range[0]+index}/>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuatList;