import Plot from 'react-plotly.js'
import Sphere from '../utils/Sphere';
import { useState, useEffect } from 'react';
import Polygon from '../utils/Polygon';
import React from 'react';
import Vector3 from '../utils/Vector3';
import Quaternion from '../utils/Quaternion';

class PersistPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: [], layout: props.layout, frames: props.frames, config: props.config};
  }
 
  render() {
    return (
      <Plot
        data={this.props.data}
        layout={this.state.layout}
        frames={this.state.frames}
        config={this.state.config}
        onInitialized={(figure) => {this.setState(figure)}}
        onUpdate={(figure) => {this.setState(figure)}}
        onClick={(e) => {
          if (this.props.setPoint) {
            this.props.setPoint(new Vector3(e.points[0].x, e.points[0].y, e.points[0].z))
            this.props.setSelection(-1)
          }
        }}
      />
    );
  }
}

const Visualization = ({ 
  selection,
  slerpN,
  newQuat,
  reference,
  quats,
  start,
  selected,
  setPoint,
  rotStart,
  rotEnd,
  index,
  setSelection
  }) => {
  const unit_sphere = new Sphere(3)
  const [vertices, setVertices] = useState([])
  const [newVertices, setNewVertices] = useState([])
  const [highlight, setHighlight] = useState(new Vector3(0,0,0))  
  const origin = {x:new Vector3(0,0,0),y:new Vector3(0,0,0),z:new Vector3(0,0,0)}
  useEffect(() => {
    const vertices = [];
    if (index!==null) {
      const quat = quats[index]
      let newVerts = {
        x: quat.rotate(reference.x),
        y: quat.rotate(reference.y),
        z: quat.rotate(reference.z),
      }
      vertices.push(newVerts)
      setHighlight(newVerts)
    } else {
      quats.forEach((quat, index) => {
        let newVerts = {
          x: quat.rotate(reference.x),
          y: quat.rotate(reference.y),
          z: quat.rotate(reference.z),
        }
        vertices.push(newVerts)
        if (start+index == selected) {
          setHighlight(newVerts)
        }
      });
    }
    setVertices(vertices)
  }, [quats, selected, index])

  useEffect(() => {
    if (rotStart && rotEnd && index!==null) {
      const start = new Quaternion(1,0,0,0)
      const end = newQuat
      const newVertices = [rotStart]
      for (var i = 1; i <= slerpN; i++) {
        const quat = start.slerp(end, i/(slerpN+1))
        newVertices.push(quat.rotate(rotStart))
      }
      newVertices.push(rotEnd)
      setNewVertices(newVertices)
    } else {
      setNewVertices([])
    }
  }, [slerpN, newQuat, quats, index, rotStart, rotEnd])

  //unit sphere
  const sphere_data = {
    type: "mesh3d",
    x: unit_sphere.sphere_vertices.map((vertex) => vertex.x),
    y: unit_sphere.sphere_vertices.map((vertex) => vertex.y),
    z: unit_sphere.sphere_vertices.map((vertex) => vertex.z),
    i: unit_sphere.sphere_i,
    j: unit_sphere.sphere_j,
    k: unit_sphere.sphere_k,
    color: 'rgb(0,0,255)',
    opacity: 0.2,
    flatshading: true,
    hoverinfo: 'none',
    hoverongaps: true
  }

  //x-axis rotation
  const x_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "x-rotation",
    x: vertices.map((vertex) => vertex.x.x),
    y: vertices.map((vertex) => vertex.x.y),
    z: vertices.map((vertex) => vertex.x.z),
    opacity: 0.2,
    line: {
      width: 10,
      color: 'rgb(255,0,0)',
    },
  }
  //x-axis
  const x_axis_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "x-axis",
    x: [origin, highlight].map((vertex) => vertex.x.x),
    y: [origin, highlight].map((vertex) => vertex.x.y),
    z: [origin, highlight].map((vertex) => vertex.x.z),
    opacity: 1,
    line: {
      width: 10,
      color: 'rgb(255,0,0)',
    },
  }
  //x-sector
  const x_sector_data = {
    type: "mesh3d",
    x: [origin.x.x, reference.x.x, highlight.x.x],
    y: [origin.x.y, reference.x.y, highlight.x.y],
    z: [origin.x.z, reference.x.z, highlight.x.z],
    i: [0],
    j: [1],
    k: [2],
    opacity: 0.2,
    color: 'rgb(255, 0, 0)'
  }

  //y-axis rotation
  const y_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "y-rotation",
    x: vertices.map((vertex) => vertex.y.x),
    y: vertices.map((vertex) => vertex.y.y),
    z: vertices.map((vertex) => vertex.y.z),
    opacity: 0.2,
    line: {
      width: 10,
      color: 'rgb(0,255,0)',
    },
  }
  //y-axis
  const y_axis_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "y-axis",
    x: [origin, highlight].map((vertex) => vertex.y.x),
    y: [origin, highlight].map((vertex) => vertex.y.y),
    z: [origin, highlight].map((vertex) => vertex.y.z),
    opacity: 1,
    line: {
      width: 10,
      color: 'rgb(0,255,0)',
    },
  }

    //y-sector
    const y_sector_data = {
      type: "mesh3d",
      x: [origin.y.x, reference.y.x, highlight.y.x],
      y: [origin.y.y, reference.y.y, highlight.y.y],
      z: [origin.y.z, reference.y.z, highlight.y.z],
      i: [0],
      j: [1],
      k: [2],
      opacity: 0.2,
      color: 'rgb(0, 255, 0)'
    }

  //z-axis rotation
  const z_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "z-rotation",
    x: vertices.map((vertex) => vertex.z.x),
    y: vertices.map((vertex) => vertex.z.y),
    z: vertices.map((vertex) => vertex.z.z),
    opacity: 0.2,
    line: {
      width: 10,
      color: 'rgb(0,0,255)',
    },
  }
  //z-axis
  const z_axis_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "z-axis",
    x: [origin, highlight].map((vertex) => vertex.z.x),
    y: [origin, highlight].map((vertex) => vertex.z.y),
    z: [origin, highlight].map((vertex) => vertex.z.z),
    opacity: 1,
    line: {
      width: 10,
      color: 'rgb(0,0,255)',
    },
  }

    //z-sector
    const z_sector_data = {
      type: "mesh3d",
      x: [origin.z.x, reference.z.x, highlight.z.x],
      y: [origin.z.y, reference.z.y, highlight.z.y],
      z: [origin.z.z, reference.z.z, highlight.z.z],
      i: [0],
      j: [1],
      k: [2],
      opacity: 0.2,
      color: 'rgb(0, 0, 255)'
    }

  const new_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "new rotation",
    x: newVertices.map((vertex) => vertex.x),
    y: newVertices.map((vertex) => vertex.y),
    z: newVertices.map((vertex) => vertex.z),
    opacity: 0.5,
    line: {
      width: 10,
      color: 'rgb(255,0,255)',
    },
  }

  var data = [
    sphere_data,
    x_axis_data,
    y_axis_data,
    z_axis_data
  ]

  if (index!==null) {
    data = data.concat([x_sector_data, y_sector_data, z_sector_data])
  } else {
    data = data.concat([x_arc_data, y_arc_data, z_arc_data])
  }

  if (rotStart && rotEnd && new Vector3(0,0,0).dist(rotStart) != 0 && new Vector3(0,0,0).dist(rotEnd) != 0) {
    data = data.concat([new_arc_data])
  }
  return (
      <PersistPlot 
        data={data}
        layout = {{
          scene:{
            aspectmode:"manual",
            aspectratio:{x:1,y:1,z:1},
            xaxis: {
              nticks: 10,
              range: [-1, 1],
            },
            yaxis: {
              nticks: 10,
              range: [-1, 1],
            },
            zaxis: {
              nticks: 10,
              range: [-1, 1],
            },
            camera: {
              eye: {x: 0, y: 2, z: 0}
            }
          },
          uirevision: "true"
        }}
        setPoint={setPoint[selection]}
        setSelection={setSelection}
      />
    );
};


export default Visualization;