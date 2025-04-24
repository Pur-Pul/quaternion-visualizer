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

app.get('/api/:index', async (req, res) => {
	const index = req.params.index
	const quat = quats[index]
	if (quat) {
		res.json(quats[index])
	} else {
		res.status(404).end()
	}
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
