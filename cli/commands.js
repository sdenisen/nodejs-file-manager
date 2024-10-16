import fsPromises from "fs/promises";
import { createHash } from 'crypto';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import path from "path";
import removeLastExtension from "./parser.js"

export async function cmd_hash(working_directory, args){
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

    // hash action.
    await fsPromises.stat(file_path).then(() => {
            fsPromises.readFile(file_path).then(file_buffer => {
                const hash = createHash('sha256').update(file_buffer).digest('hex');
                console.log(hash);
            });
    }).catch(error => {
        console.log("error during reading the file");
    });
}

export async function cmd_compress(working_directory, args){
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

    // parse arguments.
    const path_to_file = args[0];
    const path_to_destination = args[1];

    let is_error = false;
    await fsPromises.stat(path_to_file).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    await fsPromises.stat(path_to_destination).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });

    const archive_file = path.join(path_to_destination, path.basename(path_to_file) + ".gz");

    // compress action.
    await pipeline(
      fs.createReadStream(path_to_file),
      zlib.createGzip(),
      fs.createWriteStream(archive_file)
    );
}
export async function cmd_decompress(working_directory, args){
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
    await fsPromises.stat(archive_path).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });
    if (is_error) return;

    await fsPromises.stat(output_path).catch(error => {
        is_error = true;
        console.log(`something go wrong ${error.message}`);
    });

    let file_name = removeLastExtension(archive_path)
    const output_file = path.join(output_path,  path.basename(file_name));

    // decompress action.
    const sourceStream = fs.createReadStream(archive_path);
    const gunzipStream = zlib.createGunzip();
    const destinationStream = fs.createWriteStream(output_file);
    await pipeline(sourceStream, gunzipStream, destinationStream);
}