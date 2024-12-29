const pagination = query => {
  let {page = 1, limit = 20} = query

  page = parseInt(page)
  limit = parseInt(limit)

  page = Math.max(1, page)
  limit = Math.min(50, Math.max(10, limit))

  const offset = (page - 1) * limit

  return {page, limit, offset}
}

module.exports = pagination
