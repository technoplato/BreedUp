export default obj => {
  const json = JSON.stringify(obj)
  console.log(json)
  const parsed = JSON.parse(json)
  console.log(parsed)
  return parsed
}
