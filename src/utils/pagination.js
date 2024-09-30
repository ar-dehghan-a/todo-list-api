const pagination = query => {
  let {page = 0, limit = 25} = query

  page = parseInt(page)
  limit = parseInt(limit)

  page = Math.max(0, page)
  limit = Math.min(25, Math.max(1, limit))

  const offset = (page - 1) * limit

  return {page, limit, offset}
}

module.exports = pagination
