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
  newRef,
  quats,
  start,
  selected,
  setPoint,
  rotStart,
  rotEnd,
  index
  }) => {
  const unit_sphere = new Sphere(3)
  const [vertices, setVertices] = useState([])
  const [newVertices, setNewVertices] = useState([])
  const [highlight, setHighlight] = useState(new Vector3(0,0,0))  
  const origin = {x:new Vector3(0,0,0),y:new Vector3(0,0,0),z:new Vector3(0,0,0)}
  

  useEffect(() => {
    const vertices = [ reference ];
    if (index) {
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
    if (rotStart && rotEnd && index) {
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
  }, [slerpN, newQuat, quats, index])

  useEffect(() => {
    const polygons = []
    const polVerts = [vertices[0], vertices[1]]
    vertices.forEach((vertex) => {
      if (vertex.selected) {
        polVerts.push(vertex)
        polygons.push(new Polygon(0, 1, polVerts.length-1))
      }
      //setPolygons(polygons)
      //setPolVerts(polVerts)
      
    })}, [vertices]
  )

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
    x: vertices.slice(1,vertices.length).map((vertex) => vertex.x.x),
    y: vertices.slice(1,vertices.length).map((vertex) => vertex.x.y),
    z: vertices.slice(1,vertices.length).map((vertex) => vertex.x.z),
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

  //y-axis rotation
  const y_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "y-rotation",
    x: vertices.slice(1,vertices.length).map((vertex) => vertex.y.x),
    y: vertices.slice(1,vertices.length).map((vertex) => vertex.y.y),
    z: vertices.slice(1,vertices.length).map((vertex) => vertex.y.z),
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

  //z-axis rotation
  const z_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "z-rotation",
    x: vertices.slice(1,vertices.length).map((vertex) => vertex.z.x),
    y: vertices.slice(1,vertices.length).map((vertex) => vertex.z.y),
    z: vertices.slice(1,vertices.length).map((vertex) => vertex.z.z),
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

  const new_arc_data = {
    type: 'scatter3d',
    mode: 'lines',
    name: "chained rotations",
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
    x_arc_data,
    x_axis_data,
    y_arc_data,
    y_axis_data,
    z_arc_data,
    z_axis_data,
    new_arc_data
  ]
  /*
  if (new_vertices.length > 1) {
    const new_arc_data = {
      x: new_vertices.map((vertex) => vertex.x),
      y: new_vertices.map((vertex) => vertex.y),
      z: new_vertices.map((vertex) => vertex.z),
      type: 'scatter3d',
      mode: 'lines',
      name: 'new rotation',
      opacity: 0.5,
      line: {
        width: 10,
        color: 'rgb(255,0,255)',
      },
    }
    data.push(new_arc_data)
  }
    */
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
        //reference={new_vertices[0]}
        setPoint={setPoint[selection]}
      />
    );
};


export default Visualization;