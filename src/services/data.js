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
	const response = await axios.post(`${baseUrl}/quaternion`, {quats, index})
	return response.data
}

const reset = async () => {
	const response = await axios.post(`${baseUrl}/reset`)
	return response.data
}

const zero = async () => {
	const response = await axios.post(`${baseUrl}/zero`)
	return response.data
}

export default { getAll, getOne, post, reset, zero }
