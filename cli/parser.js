import path from "path";
function remove_last_extension(filePath) {
    const parsedPath = path.parse(filePath);

    if (parsedPath.ext) {
        parsedPath.base = parsedPath.name;
        parsedPath.ext = '';
    }

    return path.format(parsedPath);
}

export default remove_last_extension;