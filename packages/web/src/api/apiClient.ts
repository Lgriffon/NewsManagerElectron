import baseUrl from '../util/baseUrl'

const APIKEY_ANON = 'ANON11'

export async function fetchList() {
  const url = `${baseUrl}/articles`
  const res = await fetch(url,{
	method: 'GET',
	headers: { Accept: 'application/json, text/plain, */*' , Authorization: 'PUIRESTAUTH apikey=' + APIKEY_ANON}
  });
  console.log(res)
  
  if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`)
  return res.json()
}

export async function fetchDetail(Id:string){
  if (!Id) throw new Error('Missing ID article')
  
  const url = `${baseUrl}/article/${encodeURIComponent(Id)}`
  const res = await fetch(url,{
	method: 'GET',
	headers: { Accept: 'application/json, text/plain, */*' , Authorization: 'PUIRESTAUTH apikey=' + APIKEY_ANON}
  });
  console.log(res)

  if (!res.ok) throw new Error(`Failed to fetch detail: ${res.status}`)
  return res.json()
}