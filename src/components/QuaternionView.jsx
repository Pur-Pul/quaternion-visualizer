const QuaternionView = ({ quaternion, index}) => {
    const w = Math.round(quaternion.w * 100) / 100;
    const x = Math.round(quaternion.x * 100) / 100;
    const y = Math.round(quaternion.y * 100) / 100;
    const z = Math.round(quaternion.z * 100) / 100;
    
    return <span index={index}>
        <span style={{whiteSpace: "pre"}}>{w + "  ".repeat(Math.max(0, 6-w.toString().length))}</span>
        <span style={{whiteSpace: "pre"}}>{x + "  ".repeat(Math.max(0, 6-x.toString().length))} </span>
        <span style={{whiteSpace: "pre"}}>{y + "  ".repeat(Math.max(0, 6-y.toString().length))} </span>
        <span >{z}</span>
    </span>;
}

export default QuaternionView;