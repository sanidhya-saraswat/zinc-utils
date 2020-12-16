/* Export Functions */
module.exports.db = {
  sql: {
    getAll: async (Sequelize, model, { pageNumber = 1, limit = 5, whereClause = {}, searchString = "", attributes = { exclude: [] } } = {}) => {
      const Op = Sequelize.Op
      const offset = (pageNumber - 1) * limit
      let condition = {}
      if (searchString.length > 0) {
        let searchConditionArray = []
        for (const key in model.rawAttributes) {
          if (!["createdAt", "updatedAt", "deletedAt"].includes(key)) {
            searchConditionArray.push({ [key]: { [Op.like]: `%${searchString}%` } })
          }
        }
        condition = { [Op.or]: searchConditionArray }
      }
      condition = { ...condition, ...whereClause }
      let data = await model.findAndCountAll({
        limit,
        offset,
        attributes,
        where: condition
      })
      return getPagingData(data, pageNumber, limit)
    }
  },
  nosql: {
    getAll: async () => {
      return "Hello from NoSQL!"
    }
  }
}

/* Helper Functions */
let getPagingData = (data, pageNumber, limit) => {
  const { count: totalCount, rows: rows } = data
  const totalPages = Math.ceil(totalCount / limit)
  const pagination = { totalCount, totalPages, pageNumber, pageSize: limit }
  return { rows, pagination }
}