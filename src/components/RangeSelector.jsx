import RangeSlider from 'react-range-slider-input';

const RangeSelector = ({
    dataStart,
    setDataStart,
    range,
    setRange,
    dataStop,
    setDataStop
}) => {
    return (
        <div id="range_selector">
            <input className="range" type="number" value={dataStart} min={0} onChange={(e) => setDataStart(e.target.value)}/>
            <RangeSlider value={range} min={dataStart} max={dataStop} onInput={(val) => setRange(val)}/>
            <input className="range" type="number" value={dataStop} min={0} onChange={(e) => setDataStop(e.target.value)}/>
        </div>
    )
}

export default RangeSelector;