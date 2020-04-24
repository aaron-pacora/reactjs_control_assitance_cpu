function generateSeeders({ example, number }) {
    const array = []
    for (let index = 0; index < number; index++) {
      array.push(wrapper(example))
    }
    return array;
}
function wrapper(object){
    let clone = Object.assign({},object);
    return activateRecursively(clone)
}
function activateRecursively( object){
    for (const key in object) {//is necesary for mapping 
        let value = object[key]
        if (isFunction(value)) {
            object[key]= value();
        }else if(isObject(value)|| isArray(value)){
            activateRecursively(object[key]);
        }
    }
    return object;
}
function isFunction(element) { 
    return element instanceof Function;
}
function isArray(element) { 
    return element instanceof Array;
}
function isObject(element){
    return  element instanceof Object && element.constructor === Object;
}
export {
    generateSeeders
}