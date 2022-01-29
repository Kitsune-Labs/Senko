function print(Color, Type, Details) {
    console.log(`%c[%c${Type}%c]%c: ${Details}`, "color: orange", `color: ${Color || "red"}`, "color: orange", "color: white");
}

function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function spliceArray(Array, item) {
    return Array.splice(Array.indexOf(item), 1);
}

function stringEndsWithS (string) {
    return string.endsWith("s") ? `${string}'` : `${string}'s`;
}

module.exports = { print, wait, spliceArray, stringEndsWithS };