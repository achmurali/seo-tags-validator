# seo-tags-validator
A library to validate SEO tags for html payloads.

- Validates the basic seo friendly rules. 
- Customisable config file to add other rules for validation.

## Currently provided rules are - 
- Check for a `title` tag.
- Check if every `img` tag has an `alt` attribute.
- Check for `meta` tag with `name` attribute and value `description`.
- Check for `meta` tag with `name` attribute and value `keywords`.
- Check if the number of `h1` tags exceed count of `1`.
- Check if the number of `strong` tags exceed count of `15`.

## Usage
```
//Function for html payload validation.
const validator = require('seo-tags-validator');
validator(htmlBody,tagstoValidate);   
```

The `validator` function accepts two arguments:
1. The html payload to be validated.
2. The tags to be validated as an array. If empty validates the html payload against all the rules.


```
//Function for html file validation.
const validatorFs = require('seo-tags-validator');
validatorFs(htmlFilePath,tagsToValidate);

```
The `validatorFs` function accepts two arguments:
1. The html file path to be validated.
2. The tags to be validated as an array. If empty validates the html payload against all the rules.


## Example
```
const validator = require('seo-tags-validator');
validator(`<html><head><meta name="description" content=""/></head><body><img /></body></html>`);
```
### Output: 
```
WARNING : No <title> tag(s)
WARNING : Line: 1 <img> tag doesn't have attribute: "alt" or is empty
INFO : No <a> tags
INFO : No <h1> tag(s)
INFO : No <strong> tag(s)
WARNING : Line: 1 <meta> tag with attribute: "name" and value "description" doesn't have content attribute
WARNING : <meta> tag with attribute: "name" and value: "keywords" doesn't exist
```

## Advanced
The config file can be appended with other customisable rules.
Below is the template for the rules currently supported.

|Rule   |Description   |
|---|---|
|{ "tag": "title" } |  To check if the tag `title` exists in the html payload |    
|{"tag": "img","attribute": "alt"} | To check if every tag `img` has the attribute `alt` |   
|{"tag":"h1","count":1} | To check if the tag `h1` exceeds the given `count` |
|{"tag": "meta","attribute":{"key":"name","value":"keywords"} } | This rule is specific for `meta` tags: But can be used for checking if tag `meta` has attribute `name` and value `keywords`  |
   
Replace the tags and attributes with any of your specific requirements.