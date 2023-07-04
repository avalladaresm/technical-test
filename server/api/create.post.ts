export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const request_config: RequestInit = {
    method: "post",
    headers: {
      Authorization: `Bearer ""`
    },
    body: body
  }
  
  const data = await $fetch(`https://crudapi.co.uk/api/v1/task`, request_config)
  return data
})