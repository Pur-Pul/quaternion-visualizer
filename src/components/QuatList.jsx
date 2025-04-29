import QuaternionView from "./QuaternionView";
import Vector3 from "../utils/Vector3";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import '../styles/QuatList.css'
import QuatForm from "./QuatForm";

const QuatList = ({ quaternions, setVertices, point, setPoint, selection, setSelection}) => {
    const [range, setRange] = useState([0,1000])
    const [dataStop, setDataStop] = useState(1000)
    const [dataStart, setDataStart] = useState(0)
    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setRange([Math.max(range[0], dataStart), Math.min(range[1], dataStop)])
    }, [dataStart, dataStop])

    const quats = quaternions.slice(range[0], range[1]+1)
    const reference = new Vector3(0,0,1);
    const origin = new Vector3(0,0,0);
    useEffect(() => {
        const vertices = [ origin, reference ];
        quats.forEach((quat, index) => {
            let new_vertex = quat.rotate(reference)
            new_vertex.selected = range[0]+index == selected
            vertices.push(new_vertex)
        });
        setVertices(vertices)
    }, [quaternions, range, selected])
    const quatHoverHandler = (event) => {
        const index = event.target.getAttribute("index")
        setSelected(index)
    }

    return (
        <div>
            <div id="range_selector">
                <input className="range" type="number" value={dataStart} onChange={(e) => setDataStart(Math.max(0, e.target.value))}/>
                <RangeSlider defaultValue={range} min={dataStart} max={dataStop} onInput={(val) => setRange(val)}/>
                <input className="range" type="number" value={dataStop} onChange={(e) => setDataStop(Math.max(0, e.target.value))}/>
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
                <div>
                    <h2>Insert quaternion</h2>
                    <QuatForm point={point} setPoint={setPoint} selection={selection} setSelection={setSelection}/>
                </div>
            </div>
        </div>
    );
};

export default QuatList;