const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const Table = require('./utils/Table')
const PORT = process.env.PORT || 3000; 

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const data = fs.readFileSync("./all_data.txt").toString('utf-8');
const table = new Table(data)
const quats = []
for (let row_i = 0; row_i < table.rows.length; row_i++) {
	quats.push({
		w: table.get(row_i, 6),
		x: table.get(row_i, 3),
		y: table.get(row_i, 4), 
		z: table.get(row_i, 5)
	});
}

app.get('/api', async (req, res) => {
	res.json(quats)
})


app.post('/api/zero', async (req, res) => {
	quats.splice(0, quats.length)
	quats.push({w:1, x:0, y:0, z:0})
	res.json(quats)
})

app.post('/api/reset', async (req, res) => {
	quats.splice(0, quats.length)
	for (let row_i = 0; row_i < table.rows.length; row_i++) {
		quats.push({
			w: table.get(row_i, 6),
			x: table.get(row_i, 3),
			y: table.get(row_i, 4), 
			z: table.get(row_i, 5)
		});
	}
	res.json(quats)
})

app.get('/api/:index', async (req, res) => {
	const index = req.params.index
	const quat = quats[index]
	if (quat) {
		res.json(quats[index])
	} else {
		res.status(404).end()
	}
})

app.post('/api/quaternion', async (req, res) => {
	const newQuats = []
	const index = req.body.index
	console.log(req.body.quats)
	try {
		req.body.quats.forEach((quat) => {
			newQuats.push(
				{
					w:quat.w,
					x:quat.x,
					y:quat.y,
					z:quat.z
				}
			)
		})
	} catch {
		return res.status(400).send("Malformed quaternion.")
	}
	console.log(newQuats)
	console.log(index)
	if (index == -1 ) {
		const len = quats.length + newQuats.length
		newQuats.forEach((quat) => {
			quats.splice(0, 0, quat)
		})
		return res.json(quats.slice(0, len))
	}
	else if (index == quats.length) {
		const start = quats.length
		newQuats.foreach((quat) => {
			quats.push(quat)
		})
		return res.json(quats.slice(start))
	} else if (index > -1 && index < quats.length) {
		const start = index+1
		const len = newQuats.length
		newQuats.forEach((quat, i) => {
			quats.splice(start+i, 0, quat)
		})
		return res.json(quats.slice(start, start+len))
	} else {
		return res.status(400).send("Index out of range.")
	}
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
