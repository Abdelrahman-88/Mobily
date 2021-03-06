const searchService = async(search, value, limit, skip, model, fields, populate, select, mainSelect) => {
    let data, total, totalPages
    Object.keys(value).forEach(key => {
        if (value[key] === '' || value[key] === undefined || value[key] === null) {
            delete value[key];
        }
    });
    if (search) {
        const queries = fields.map((i) => {
            return {
                [i]: { $regex: search }
            };
        });
        data = await model.find({
            ...value,
            $or: queries
        }).select(mainSelect).populate(populate).select(select).skip(skip).limit(parseInt(limit))
        total = await model.find({
            ...value,
            $or: queries
        }).select(mainSelect).populate(populate).select(select).count()
        totalPages = Math.ceil(total / limit)
    } else {
        data = await model.find({
            ...value
        }).select(mainSelect).populate(populate, select).skip(skip).limit(parseInt(limit))
        total = await model.find({
            ...value
        }).select(mainSelect).populate(populate, select).count()
        totalPages = Math.ceil(total / limit)
    }
    return { data, total, totalPages }
}


module.exports = searchService