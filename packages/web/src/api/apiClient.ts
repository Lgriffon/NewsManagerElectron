// apiClient.ts
import axios from 'axios'
import baseUrl from '../util/baseUrl'

const http = axios.create({
	baseURL: baseUrl,
	headers: { Accept: 'application/json, text/plain, */*' },
})

const APIKEY_ANON = ''

//TODO : add API calls here
