import path from "path";
function removeLastExtension(filePath) {
    const parsedPath = path.parse(filePath);

    if (parsedPath.ext) {
        parsedPath.base = parsedPath.name;
        parsedPath.ext = '';
    }

    return path.format(parsedPath);
}

export default removeLastExtension;