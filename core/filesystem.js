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
    const full_path_to_file = path.isAbsolute(init_path_to_file) ? init_path_to_file : path.resolve(working_directory, init_path_to_file);

    const destination_directory = args[1];
    const destination_path_to_file = path.isAbsolute(destination_directory) ? destination_directory : path.resolve(working_directory, destination_directory);

    if (!is_path_exists(destination_path_to_file) || !is_path_exists(full_path_to_file)){
        return;
    }

    const destination = path.join(destination_path_to_file, path.basename(init_path_to_file));
    // copy action.
    const readStream = fs.createReadStream(full_path_to_file);
    const writeStream = fs.createWriteStream(destination);

    readStream.on('error', (error) => {
        reject(`Error reading source file: ${error.message}`);
    });
    writeStream.on('error', (error) => {
        reject(`Error writing destination file: ${error.message}`);
    });

    readStream.pipe(writeStream);
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
    const init_path_to_file = args[0];
    const full_path_to_file = path.isAbsolute(init_path_to_file) ? init_path_to_file : path.resolve(working_directory, init_path_to_file);

    const destination_directory = args[1];
    const destination_path_to_file = path.isAbsolute(destination_directory) ? destination_directory : path.resolve(working_directory, destination_directory);

    if (!is_path_exists(destination_path_to_file) || !is_path_exists(full_path_to_file)){
        return;
    }

    const destination = path.join(destination_path_to_file, path.basename(init_path_to_file));

    // move action.
    const readStream = fs.createReadStream(full_path_to_file);
    const writeStream = fs.createWriteStream(destination);

    readStream.on('error', (error) => {
        reject(`Error reading source file: ${error.message}`);
    });
    writeStream.on('error', (error) => {
        reject(`Error writing destination file: ${error.message}`);
    });

    writeStream.on('close', () => {
            fs.unlink(full_path_to_file, (err) => {
                if (err) {
                    console.error(`Error deleting source file: ${err.message}`);
                }
            });
        });

    readStream.pipe(writeStream);
}


export function cmd_rm(working_directory, args){
    // Delete file: rm path_to_file
    is_args_correct(args)

    // parse arguments.
    const file_to_remove = args[0];
    const full_path_to_file = path.isAbsolute(file_to_remove) ? file_to_remove : path.resolve(working_directory, file_to_remove);

    if (!is_path_exists(full_path_to_file)){
        return;
    }

    fs.unlink(full_path_to_file, (error) => {
        if (error) {
              console.error(`Operation failed: ${error}`);
        }
    });
}



