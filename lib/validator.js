const cheerio = require('cheerio');
const colors = require('colors');

const tagConfig = require("./config.json");

const validator = (requestBody, tagstoValidate) => {
    try {
        if (!tagstoValidate || tagstoValidate.length === 0)
            tagstoValidate = getAllTags();

        const $ = cheerio.load(requestBody, {
            sourceCodeLocationInfo: true
        });
        
        tagstoValidate.forEach(tagName => {
            let tagConfigurations = getTagConfiguration(tagName);
            if (tagConfigurations.length != 0)
                validateTags(tagConfigurations, tagName, $);
            else
                throw new Error(`No configuration exists for the tag: ${tagName}`)
        });
    }
    catch (err) {
        log.error(`ERROR : ${err.message} \n ${err.stack}`);
    }
}

const getTagConfiguration = (tagName) => {
    return tagConfig.filter((ele) => ele.tag === tagName);
}

const getAllTags = () => {
    const allTags = new Set();
    tagConfig.forEach((ele) => {
        allTags.add(ele.tag);
    });
    return Array.from(allTags);
}

const validateTags = (tagConfigurations, tagName, $) => {
    try {
        tagConfigurations.forEach((configuration) => {
            if (!configuration.attribute && !configuration.count)
                checkTagExists($, tagName);
            else if (configuration.count)
                checkTagCount($, tagName, configuration.count);
            else if (typeof configuration.attribute === "string")
                checkTagWithAttributeExists($, tagName, configuration.attribute);
            else if (configuration.attribute && Object.keys(configuration.attribute).length > 0)
                checkTagWithAttributeValueExists($, tagName, configuration.attribute.key, configuration.attribute.value)
        });
    }
    catch (err) {
        log.error(`ERROR: Couldn't validate tag : ${tagName} \n ${err.stack}`);
    }

}

/*To check if a ${tagName} with given ${attribute} and ${attributeValue} exists */
const checkTagWithAttributeValueExists = ($, tagName, attribute, attributeValue) => {
    const tags = $(`${tagName}[${attribute} = '${attributeValue}']`).get();
    if (tags.length == 0)
        log.warning(`WARNING : <${tagName}> tag with attribute: "${attribute}" and value: "${attributeValue}" doesn't exist`);
    else if (tagName === "meta") {
        tags.forEach(ele => {
            if (ele.type === "tag" && !ele.attribs["content"] || !ele.attribs["content"].trim())
                log.warning(`WARNING : Line: ${ele.sourceCodeLocation.startLine} <${tagName}> tag with attribute: "${attribute}" and value "${attributeValue}" doesn't have content attribute`);
        })
    }
}

/* To check if every ${tagName} has given ${attribute} */
const checkTagWithAttributeExists = ($, tagName, attribute) => {
    const tags = $(`${tagName}`).get();
    if (tags.length === 0)
        log.info(`INFO : No <${tagName}> tags`);
    tags.forEach(ele => {
        if (ele.type === "tag" && !ele.attribs[attribute] || !ele.attribs[attribute].trim())
            log.warning(`WARNING : Line: ${ele.sourceCodeLocation.startLine} <${tagName}> tag doesn't have attribute: "${attribute}" or is empty`);
    });
}

/* To check if ${tagName} exists in the document */
const checkTagExists = ($, tagName) => {
    const tags = $(`${tagName}`).get();
    if (tags.length == 0)
        log.warning(`WARNING : No <${tagName}> tag(s)`);
    else
        tags.forEach(ele => {
            if (ele.type === "tag" && !ele.children.some((children) => children.type === "text" && children.data.trim()))
                log.warning(`WARNING : Line: ${ele.sourceCodeLocation.startLine} <${tagName}> tag doesn't have any content`);
        });
}

/* To check if ${tagName} exceeds the ${tagCount} */
const checkTagCount = ($, tagName, tagCount) => {
    const tags = $(`${tagName}`).get();
    if (tags.length > tagCount)
        log.warning(`WARNING : <${tagName}> exceeds the count : ${tagCount}`);
    else if(tags.length == 0)
        log.info(`INFO : No <${tagName}> tag(s)`);
}

const log = {
    warning:(str) => {
        console.log(colors.yellow(str))
    },
    info:(str) => {
        console.log(str)
    },
    error:(str) => {
        console.log(colors.red(str))
    }
} 


module.exports = {
    validator
}