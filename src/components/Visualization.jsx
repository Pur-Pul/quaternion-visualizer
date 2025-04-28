import Plot from 'react-plotly.js'
import Sphere from '../utils/Sphere';
import { useState, useEffect } from 'react';
import Vector3 from '../utils/Vector3';
import Polygon from '../utils/Polygon';

const Visualization = ({ vertices }) => {
    const unit_sphere = new Sphere(3)
    const [cam, setCam] = useState(new Vector3(0, 2, 0))
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
    return (
        <Plot 
          data={[
            {
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
            },
            {
              type: "mesh3d",
              x: polVerts.map((vertex) => vertex.x),
              y: polVerts.map((vertex) => vertex.y),
              z: polVerts.map((vertex) => vertex.z),
              i: polygons.map((polygon) => polygon.v1),
              j: polygons.map((polygon) => polygon.v2),
              k: polygons.map((polygon) => polygon.v3),
              opacity: 0.5,
              color: 'rgb(255, 132, 0)'
            },
            {
              type: 'scatter3d',
              mode: 'lines',
              x: vertices.slice(2,vertices.length).map((vertex) => vertex.x),
              y: vertices.slice(2,vertices.length).map((vertex) => vertex.y),
              z: vertices.slice(2,vertices.length).map((vertex) => vertex.z),
              opacity: 0.5,
              line: {
                width: 10,
                color: 'rgb(255,0,0)',
              },
            },
            {
              type: 'scatter3d',
              mode: 'lines',
              x: polVerts.slice(1, polVerts.length).map((vertex) => vertex.x),
              y: polVerts.slice(1, polVerts.length).map((vertex) => vertex.y),
              z: polVerts.slice(1, polVerts.length).map((vertex) => vertex.z),
              opacity: 0.5,
              line: {
                width: 10,
                color: 'rgb(0,255,0)',
              },
            },
          ]
        }
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
              eye: cam
            },
            uirevision: "camera"
          }
        }}
        />
      );
};

export default Visualization;