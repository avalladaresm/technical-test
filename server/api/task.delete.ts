export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const request_config = {
    method: "delete",
    headers: {
      Authorization: `Bearer ""`
    }
  }

  const data = await $fetch(`https://crudapi.co.uk/api/v1/task/${body.uuid}`, request_config)
  return data
})