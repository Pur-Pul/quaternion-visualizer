
const QuaternionView = ({ quaternion, index}) => {
    const w = Math.round(quaternion.w * 100) / 100;
    const x = Math.round(quaternion.x * 100) / 100;
    const y = Math.round(quaternion.y * 100) / 100;
    const z = Math.round(quaternion.z * 100) / 100;
    return <span index={index}>{w} {x} {y} {z}</span>;
}

export default QuaternionView;