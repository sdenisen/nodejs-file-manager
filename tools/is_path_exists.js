import {statSync} from 'node:fs';

export function is_path_exists(path_to_check) {
    try {
        statSync(path_to_check);
        return true;
    } catch (error) {
        if (error.code === "ENOENT") {
            console.error('Error: Path/File does not exist.');
            return false;
        } else {
            console.error('Operation failed:', error);
        }
    }
}