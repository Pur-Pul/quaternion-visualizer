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
          if (this.props.setNewQuat) {
            const point = new Vector3(e.points[0].x, e.points[0].y, e.points[0].z)
            const axis = this.props.reference.cross(point).normalize()
            const angle = point.angle(this.props.reference)
            this.props.setNewQuat(Quaternion.axisAngle(axis, angle))
          }
        }}
      />
    );
  }
}

const Visualization = ({ vertices, selection, slerpN, newQuat, setNewQuat, reference, newRef}) => {
    const unit_sphere = new Sphere(3)
    const [polygons, setPolygons] = useState([])
    const [polVerts, setPolVerts] = useState([])
    useEffect(() => {
      const polygons = []
      const polVerts = [vertices[0], vertices[1]]
      vertices.forEach((vertex) => {
        if (vertex.selected) {
          polVerts.push(vertex)
          polygons.push(new Polygon(0, 1, polVerts.length-1))
        }
        setPolygons(polygons)
        setPolVerts(polVerts)
        
      })}, [vertices]
    )
    const new_vertices = [newRef ? newRef : reference];
    for (var i = 0; i < slerpN; i++) {
      const slerpQuat = new Quaternion(1,0,0,0).slerp(newQuat, (i+1)/(slerpN+1))
      new_vertices.push(slerpQuat.rotate(new_vertices[0]))
    }
    new_vertices.push(newQuat.rotate(new_vertices[0]))
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
    const sector_data = {
      type: "mesh3d",
      x: polVerts.map((vertex) => vertex.x),
      y: polVerts.map((vertex) => vertex.y),
      z: polVerts.map((vertex) => vertex.z),
      i: polygons.map((polygon) => polygon.v1),
      j: polygons.map((polygon) => polygon.v2),
      k: polygons.map((polygon) => polygon.v3),
      opacity: 0.5,
      color: 'rgb(255, 132, 0)'
    }
    const chained_arc_data = {
      type: 'scatter3d',
      mode: 'lines',
      name: "chained rotations",
      x: vertices.slice(2,vertices.length).map((vertex) => vertex.x),
      y: vertices.slice(2,vertices.length).map((vertex) => vertex.y),
      z: vertices.slice(2,vertices.length).map((vertex) => vertex.z),
      opacity: 0.5,
      line: {
        width: 10,
        color: 'rgb(255,0,0)',
      },
    }
    const direct_arc_data = {
      type: 'scatter3d',
      mode: 'lines',
      name: "direct rotation",
      x: polVerts.slice(1, polVerts.length).map((vertex) => vertex.x),
      y: polVerts.slice(1, polVerts.length).map((vertex) => vertex.y),
      z: polVerts.slice(1, polVerts.length).map((vertex) => vertex.z),
      opacity: 0.5,
      line: {
        width: 10,
        color: 'rgb(0,255,0)',
      },
    }
    
    var data = [sphere_data, sector_data, chained_arc_data, direct_arc_data]
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
          setNewQuat={selection ? setNewQuat : undefined}
          reference={new_vertices[0]}
        />
      );
};

export default Visualization;