import _ from "lodash"

const getDataShop = ({fileds = [], object = {}})=>{
    return _.pick({fileds,object})
}

export default getDataShop