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
    range,
    setRange,
    dataStart,
    setDataStart,
    dataStop,
    setDataStop,
    setSelected,
    setIndex
    }) => {
    useEffect(() => {
        setIndex(null)
    }, [])

    const navigate = useNavigate()

    return (
        <div>
            <div id="list_container">
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Quaternion</th>
                        </tr>
                    </thead>
                    <tbody>
                    {quaternions.map((quaternion, index) => {
                        return(
                            <tr key={range[0]+index}>
                                <td>
                                    {range[0]+index}
                                </td>
                                <td id="quaternion" onMouseOver={() => setSelected(range[0]+index)} onClick={() => navigate(`/quaternion/${range[0]+index}`)}>
                                    <QuaternionView quaternion={quaternion}/>
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