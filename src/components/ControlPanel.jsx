import Quaternion from "../utils/Quaternion"
import dataService from "../services/data"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"


const ControlPanel = ({ range, setQuaternions }) => {
    return (
        <div style={{display: "flex"}}>
            <div>
                <input type="button" value="reset" onClick={async () => {
                    const data = await dataService.reset()
                    setQuaternions(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
                }}/>
                <input type="button" value="zero" onClick={async () => {
                    const data = await dataService.zero()
                    setQuaternions(data.map((quat) => new Quaternion(quat.w, quat.x, quat.y, quat.z)))
                }}/>
            </div>
        </div>
    )
}

export default ControlPanel;