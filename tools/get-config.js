
const getConfig = () => {
    let config = {
        "watson": {
            "discovery": {
                "version": process.env.DISCOVERY_VERSION,
                "apikey": process.env.DISCOVERY_API_KEY,
                "serviceUrl": process.env.DISCOVERY_URL,
                "environmentId": process.env.DISCOVERY_ENVIRONMENT,
                "collectionId": process.env.DISCOVERY_COLLECTION
            }
        }
    }

    const envNullNum = 
        Object.keys(config.watson.discovery)
        .filter((key) => (!config.watson.discovery[key]))
        .length
    if(envNullNum > 0){
        config = require("../config/default.json");
    }

    return config;
}

module.exports = getConfig;