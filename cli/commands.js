import fsPromises from "fs/promises";
import { createHash } from 'crypto';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import path from "path";
import remove_last_extension from "./parser.js"
import {is_path_exists} from "../tools/is_path_exists.js";

export function cmd_hash(working_directory, args){
    // Calculate hash for file and print it into console
    // hash path_to_file

     if (args.length > 1) {
        console.log("Too many arguments");
        return;
    }

    if (args.length === 0) {
        console.log("Missed some required arguments")
        return;
    }

    // parse arguments.
    const file_path = args[0];
    const full_path_to_file = path.isAbsolute(file_path) ? file_path : path.resolve(working_directory, file_path);

    if(!is_path_exists(full_path_to_file)){
        return;
    }

    // hash action.
    fsPromises.readFile(full_path_to_file).then(file_buffer => {
        const hash = createHash('sha256').update(file_buffer).digest('hex');
        console.log(hash);
    });
}

export function cmd_compress(working_directory, args){
    // Compress file (using Brotli algorithm, should be done using Streams API)
    // compress path_to_file path_to_destination

     if (args.length > 2) {
        console.log("Too many arguments");
        return;
    }

    if (args.length < 2) {
        console.log("Missed some required arguments")
        return;
    }

    const init_path_to_file = args[0];
    const full_path_to_file = path.isAbsolute(init_path_to_file) ? init_path_to_file : path.resolve(working_directory, init_path_to_file);

    const destination_directory = args[1];
    const destination_path_to_file = path.isAbsolute(destination_directory) ? destination_directory : path.resolve(working_directory, destination_directory);

    if (!is_path_exists(destination_path_to_file) || !is_path_exists(full_path_to_file)){
        return;
    }

    const archive_file = path.join(destination_path_to_file, path.basename(init_path_to_file) + ".gz");

    // compress action.
    pipeline(
      fs.createReadStream(full_path_to_file),
      zlib.createGzip(),
      fs.createWriteStream(archive_file)
    );
}
export function cmd_decompress(working_directory, args){
    // Decompress file (using Brotli algorithm, should be done using Streams API)
    // decompress path_to_file path_to_destination

     if (args.length > 2) {
        console.log("Too many arguments");
        return;
    }

    if (args.length < 2) {
        console.log("Missed some required arguments")
        return;
    }

    // parse arguments.
    const archive_path = args[0];
    const output_path = args[1];

    let is_error = false;
    fsPromises.stat(archive_path).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    fsPromises.stat(output_path).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });

    let file_name = remove_last_extension(archive_path)
    const output_file = path.join(output_path,  path.basename(file_name));

    // decompress action.
    const sourceStream = fs.createReadStream(archive_path);
    const gunzipStream = zlib.createGunzip();
    const destinationStream = fs.createWriteStream(output_file);
    pipeline(sourceStream, gunzipStream, destinationStream);
}