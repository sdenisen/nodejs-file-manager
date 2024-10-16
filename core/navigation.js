import path from 'path';
import {readdir} from "fs/promises";
import fs from "fs";


export function cmd_up(current_directory, args) {
    current_directory = path.dirname(current_directory);
    return current_directory;
}

export function cmd_cd(current_directory, args) {
    // implement CD command.

    if (args.length > 1) {
        console.log("too many arguments")
        return current_directory
    }

    if (args.length === 0) {
        console.log("no any arguments passed")
        return current_directory
    }

    let directory_to_set = args[0];
    if (!fs.existsSync(directory_to_set)) {
        console.log("wrong path. please check.");

    }

    return directory_to_set;
}


export async function cmd_ls(working_directory, args) {
    if (args.length > 1) {
        console.log("too many arguments");
        return;
    }

    let directory_to_list = args.length === 0 ? working_directory : args[0];

    if (!fs.existsSync(directory_to_list)) {
        console.log("wrong path. please check.");
        return;
    }

    const files = await readdir(directory_to_list, {withFileTypes: true});
    files.forEach(file => {
        if (file.isDirectory()) {
            console.log(`${file.name}/`);
        } else {
            console.log(file.name)
        }
    });

}
