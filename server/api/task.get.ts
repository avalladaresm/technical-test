export default defineEventHandler(async () => {
  const request_config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${process.env.CRUDAPI_KEY}`
    }
  }

  const data = await $fetch("https://crudapi.co.uk/api/v1/task", request_config)
  return data.items
})