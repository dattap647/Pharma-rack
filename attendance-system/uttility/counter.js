const Counter = require('../model/counter');

const getNextID = async (counter_name) => {
    try {
        let counter = await Counter.findOneAndUpdate(
            { id : counter_name},
            { $inc : { value : 1 }},
            { new: true, upsert: true}
        );
        return counter.value;
    } catch (error) {
        throw handleCustomError(error, 500);
    }
}

module.exports = {
    getNextID
};