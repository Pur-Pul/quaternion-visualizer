import axios from 'axios'
const baseUrl = '/api'

const getAll = async () => {
	const response = await axios.get(`${baseUrl}`)
	return response.data
}

const getOne = async (index) => {
	const response = await axios.get(`${baseUrl}/${index}`)
	return response.data
}

const post = async (quats, index) => {
	const response = await axios.post(`${baseUrl}`, {quats, index})
	return response.data
}


export default { getAll, getOne, post }
