import path from 'path';
import {join} from 'path';
import fs from "node:fs/promises"
import { statSync } from 'fs';
import { homedir } from 'os';



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
    if (directory_to_set.startsWith('~')){
        directory_to_set = join(homedir(), directory_to_set.slice(1));
    }

    const stats = statSync(directory_to_set);
    if (!stats.isDirectory()) {
        console.log("wrong path. please check.");
    }
    return directory_to_set;

}


export function cmd_ls(working_directory, args) {
    if (args.length > 1) {
        console.log("too many arguments");
        return;
    }

    let directory_to_list = args.length === 0 ? working_directory : args[0];

    if (directory_to_list.startsWith('~')){
        directory_to_list = join(homedir(), directory_to_list.slice(1));
    }

    const stats = statSync(directory_to_list);
    if (!stats.isDirectory()) {
        console.log("wrong path. please check.");
        return;
    }

    fs.readdir(directory_to_list, {withFileTypes: true}).then(files => {
        let r_files = []
        let r_dirs = []
        let r = []
        files.forEach((file) => {
            if (file.isDirectory()){
                r_dirs.push({"Name": file.name, "Type": file.isDirectory() ? "directory" : "file" })
            } else {
                r_files.push({"Name": file.name, "Type": file.isDirectory() ? "directory" : "file" })
            }
        });
        r_dirs.sort()
        r_files.sort()
        r.push.apply(r, r_dirs)
        r.push.apply(r, r_files)
        console.table(r);
    });
};
