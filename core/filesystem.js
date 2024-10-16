import path from 'path';
import process from "node:process"
import fs from 'node:fs';
import fsPromises from 'fs/promises';
import { constants } from 'fs';

export async function cmd_cat(working_directory, args){
    // Read file and print it's content in console (should be done using Readable stream):
    // cat path_to_file
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


    const stream = fs.createReadStream(full_path_to_file, { encoding: 'utf8' });
    stream.on('error', (error) => {
        console.error(`Error during reading the file: ${error.message}`);
    });
    stream.pipe(process.stdout);
}


export async function cmd_add(working_directory, args){
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

export async function cmd_rn(working_directory, args){
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
    const args_new_file_name = args[1];
    const old_directory = path.dirname(args_path_to_file);
    const old_file_name = path.basename(args_path_to_file);
    const new_file_name = path.basename(args_new_file_name);

    let old_dir = old_directory === "."?  working_directory: old_directory;
    const full_path_to_old_file = path.join(old_dir, old_file_name);
    const full_path_to_new_file = path.join(old_dir, new_file_name);
    let is_error = false
    await fsPromises.stat(full_path_to_old_file).catch(error => {
        console.log(`The file ${old_file_name} doesn't exist.`);
        is_error = true;
    });
    if (is_error) return;

    await fsPromises.stat(full_path_to_new_file).then(() => {
        console.log(`The file ${new_file_name} already exist.`);
        is_error = true;
    }).catch((error) => {
        if(error.code !== 'ENOENT'){
            Promise.reject(error)
        }
    });

    if (is_error) return;

    await fsPromises.rename(old_file_name, new_file_name).catch((error) => {
        if (error.code === 'ENOENT'){
            console.log(`${error.message}`);
        }
    });
}

export async function cmd_cp(working_directory, args){
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


    await fsPromises.stat(init_path_to_file).catch(error => {
        is_error = true;
    });
    if (is_error) return;

    await fsPromises.stat(destination_directory).catch(error => {
        is_error = true;
        console.log(error.message);
    });
    if (is_error) return;

    console.log("we are gete")
    await fsPromises.copyFile(init_path_to_file, destination_path_to_file, constants.COPYFILE_EXCL)
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

export async function cmd_mv(working_directory, args){
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

    await fsPromises.stat(source_path_to_file).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    await fsPromises.stat(destination_path_to_file).then(() => {
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

    await writeStream.on('close', () => {
            fs.unlink(source_path_to_file, (err) => {
                if (err) {
                    Promise.reject(`Error deleting source file: ${err.message}`);
                } else {
                    Promise.resolve('File moved successfully.');
                }
            });
        });

    await readStream.pipe(writeStream);
}


export async function cmd_rm(working_directory, args){
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

    await fsPromises.stat(file_to_remove).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    // remove action.
    await fsPromises.unlink(file_to_remove);
}



