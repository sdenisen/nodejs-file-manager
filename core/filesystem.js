import path from 'path';
import process from "node:process"
import fs from 'node:fs';
import fsPromises from 'fs/promises';
import { constants } from 'fs';
import {is_path_exists} from "../tools/is_path_exists.js";
import {is_args_correct} from "../tools/is_args_correct.js";
import {statSync} from 'node:fs';

export function cmd_cat(working_directory, args){
    // Read file and print it's content in console (should be done using Readable stream):
    // cat path_to_file

    if (!is_args_correct(args)){
        return;
    }

    const path_to_file = args[0];
    const full_path_to_file = path.isAbsolute(path_to_file) ? path_to_file : path.resolve(working_directory, path_to_file);

    if (!is_path_exists(full_path_to_file)){
        return;
    }

    const stream = fs.createReadStream(full_path_to_file, { encoding: 'utf8' });
    stream.on('error', (error) => {
        console.error(`Error during reading the file: ${error.message}`);
    });
    stream.pipe(process.stdout);
}


export function cmd_add(working_directory, args){
    // Create empty file in current working directory:
    // add new_file_name

    if (args.length > 1) {
        console.log("too many arguments");
        return;
    }

    if (args.length === 0) {
        console.log("no any arguments passed")
        return;
    }

    const directory = path.dirname(args[0]);
    const file_name = path.basename(args[0]);

    let dir = directory === "."?  working_directory: directory;
    const full_path_to_file = path.join(dir, file_name);

    fsPromises.writeFile(full_path_to_file, "", {flag: "wx"}).then(()=>{

    }).catch((error) => {
       if (error.code === "EEXIST"){
            console.log("The file already exist");
       } else {
           console.error(`Something go wrong: ${error.message}`);
       }
    });
}

export function cmd_mkdir(working_directory, args){
    if (!is_args_correct(args)){
        return;
    }

    const path_to_directory = args[0];
    const full_path_to_file = path.isAbsolute(path_to_directory) ? path_to_directory : path.resolve(working_directory, path_to_directory);
    console.log(full_path_to_file)
    try {
        statSync(full_path_to_file);
        console.log("The directory already exists.")
        return;
    } catch (error) {
        if (error.code === "ENOENT") {
            fs.mkdir(full_path_to_file, (error) => {
                if (error){
                    console.log("Operation failed:", error)
                }
            });
        } else {
            console.error('Operation failed:', error);
        }
    }
}

export function cmd_rn(working_directory, args){
    //Rename file (content should remain unchanged):
    // rn path_to_file new_filename

    if (args.length > 2) {
        console.log("too many arguments");
        return;
    }

    if (args.length < 2) {
        console.log("missed some arguments")
        return;
    }

    const args_path_to_file = args[0];
    const full_path_to_file = path.isAbsolute(args_path_to_file) ? args_path_to_file : path.resolve(working_directory, args_path_to_file);

    if (!is_path_exists(full_path_to_file)){
        return;
    }

    const args_new_file_name = args[1];
    const new_directory = path.dirname(full_path_to_file);
    const full_path_to_new_file = path.join(new_directory, args_new_file_name)

    try {
        statSync(full_path_to_new_file);
        console.log(`The file ${args_new_file_name} already exist.`)
        return;
    } catch (error) {
        if (error.code === "ENOENT") {
            fs.rename(full_path_to_file, full_path_to_new_file, (error) => {
                if (error){
                    console.log(`${error.message}`);
                }
            });
        } else {
            console.error('Operation failed:', error);
        }
    }
}

export function cmd_cp(working_directory, args){
    //cp path_to_file path_to_new_directory
    //Copy file (should be done using Readable and Writable streams):

    if (args.length > 2) {
        console.log("Too many arguments");
        return;
    }

    if (args.length < 2) {
        console.log("Missed some required arguments")
        return;
    }

    // parse arguments.
    let is_error = false;
    const init_path_to_file = args[0];
    const destination_directory = args[1];
    const destination_path_to_file = path.join(destination_directory, path.basename(init_path_to_file));


    fsPromises.stat(init_path_to_file).catch(error => {
        is_error = true;
    });
    if (is_error) return;

    fsPromises.stat(destination_directory).catch(error => {
        is_error = true;
        console.log(error.message);
    });
    if (is_error) return;

    console.log("we are gete")
    fsPromises.copyFile(init_path_to_file, destination_path_to_file, constants.COPYFILE_EXCL)
        .catch(error => {
            if (error.code === "ERR_FS_CP_EEXIST") {
                console.error("The file already exist");
                Promise.reject();
            }
            if (error.code === "ENOENT") {
              console.error(`Something go wrong ${error.message}`);
              Promise.reject();
            }
            console.log(error.message)
        });
}

export function cmd_mv(working_directory, args){
    // Move file (same as copy but initial file is deleted,
    // copying part should be done using Readable and Writable streams):
    // mv path_to_file path_to_new_directory

     if (args.length > 2) {
        console.log("Too many arguments");
        return;
    }

    if (args.length < 2) {
        console.log("Missed some required arguments")
        return;
    }

    // parse arguments.
    let is_error = false;
    const source_path_to_file = args[0];
    const destination_directory = args[1];
    const destination_path_to_file = path.join(destination_directory, path.basename(source_path_to_file));

    fsPromises.stat(source_path_to_file).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    fsPromises.stat(destination_path_to_file).then(() => {
        is_error = true;
        console.log("The file already exist");
    }).catch((error) => {
        if (error.code !== "ENOENT"){
            console.log(`something go wrong ${error.message}`)
            Promise.reject();
        }
    });
    if (is_error) return;

    // move action.
    const readStream = fs.createReadStream(source_path_to_file);
    const writeStream = fs.createWriteStream(destination_path_to_file);

    readStream.on('error', (error) => {
        reject(`Error reading source file: ${error.message}`);
    });
    writeStream.on('error', (error) => {
        reject(`Error writing destination file: ${error.message}`);
    });

    writeStream.on('close', () => {
            fs.unlink(source_path_to_file, (err) => {
                if (err) {
                    Promise.reject(`Error deleting source file: ${err.message}`);
                } else {
                    Promise.resolve('File moved successfully.');
                }
            });
        });

    readStream.pipe(writeStream);
}


export function cmd_rm(working_directory, args){
    // Delete file:
    // rm path_to_file

     if (args.length > 1) {
        console.log("Too many arguments");
        return;
    }

    if (args.length === 0) {
        console.log("Missed some required arguments")
        return;
    }

    // parse arguments.
    let is_error = false;
    const file_to_remove = args[0];

    fsPromises.stat(file_to_remove).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    // remove action.
    fsPromises.unlink(file_to_remove);
}



