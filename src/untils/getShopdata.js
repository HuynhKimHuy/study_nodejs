import _ from "lodash"

const getDataShop = ({ fields = [], object = {} }) => _.pick(object, fields)

export default getDataShop
