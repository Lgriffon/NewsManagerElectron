
import axios from 'axios'
import baseUrl from '../util/baseUrl'

const APIKEY_ANON = 'ANON11'

const http = axios.create({
	baseURL: baseUrl,
	headers: { Accept: 'application/json, text/plain, */*' , Authorization: 'PUIRESTAUTH apikey=' + APIKEY_ANON},
})

export async function fetchList(limit = 151, offset = 0) {
  const url = `${baseUrl}`
  const res = await fetch(url,{
	method: 'GET',
	headers: { Accept: 'application/json, text/plain, */*' , Authorization: 'PUIRESTAUTH apikey=' + APIKEY_ANON}
  });
  console.log(res.status)
  
  if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`)
  return res.json()
}
