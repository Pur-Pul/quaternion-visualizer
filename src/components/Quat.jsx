import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Quaternion from "../utils/Quaternion";
import QuaternionView from "./QuaternionView";
import dataService from '../services/data';

const Quat = ({ setIndex }) => {
    let params = useParams();
    const [quaternion, setQuaternion] = useState(undefined)
    const navigate = useNavigate()
    useEffect(() => {
        const fetch = async () => {
            const data = await dataService.getOne(Number(params.index))
            setQuaternion(new Quaternion(data.w, data.x, data.y, data.z))
        }
        if (params.index!==undefined) {
            fetch()
            setIndex(Number(params.index))
        }
    }, [params.index])
    
    if (quaternion===undefined) { return <>loading</> }
    
    const handleCancel = () => {
        navigate("/")
    }

    return (
        <div>
            <h2>Index {params.index}</h2>
            <div>
                <QuaternionView quaternion={quaternion} index={params.index}/>
            </div>
            <input type="button" value="Go back" onClick={handleCancel}/>
            <input type="button" value="Insert rotation" onClick={() => navigate(`/insert/${params.index}`)}/>
        </div>
    )
}

export default Quat;