"use strict";
const _ = require("lodash");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class FunctionLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isFunction(resource) || (_.isFunction(resource) && 'function' === type);
    }
    load(callback, type = null) {
        var resource = callback(this.container);
        if (!_.isPlainObject(resource)) {
            throw new Error(`Function does not return Object`);
        }
        var imports = [];
        if ('imports' in resource) {
            imports = resource['imports'];
            delete resource['imports'];
        }
        this.importFromArray(imports, 'function');
        _.merge(this.container, resource);
    }
}
exports.FunctionLoader = FunctionLoader;
//# sourceMappingURL=FunctionLoader.js.map