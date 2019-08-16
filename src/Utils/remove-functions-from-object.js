export default obj => {
  const json = JSON.stringify(obj)
  const parsed = JSON.parse(json)
  return parsed
}
