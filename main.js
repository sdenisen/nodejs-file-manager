import path from "path";
import readline from "node:readline";
import {fileURLToPath} from "url";
import {cmd_cd, cmd_ls, cmd_up} from "./core/navigation.js";
import {cmd_cat, cmd_add, cmd_rn, cmd_cp, cmd_mv, cmd_rm, cmd_mkdir} from "./core/filesystem.js";
import {cmd_hash, cmd_compress, cmd_decompress} from "./cli/commands.js";
import {cmd_os} from "./core/operationsystem.js";
import { homedir } from "os";

const main_loop = () => {
    let working_directory = "";
    let username = "";
    const cli_args = process.argv.slice(2); // common line arguments

    // initiate the working directory:
    const __filename = fileURLToPath(import.meta.url);
    working_directory = homedir();

    for (let i = 0; i < cli_args.length; i++) {
        const argument = cli_args[i];
        const isFlag = argument.startsWith("--");
        if (isFlag) {
            const key_value_pair = argument.split("=")
            const key = key_value_pair[0];
            const value = key_value_pair[1];
            if ("--username" === key) {
                username = value
            }
            i++;
        }
    }

    const greeting = username? `Welcome to the File Manager, ${username}!`: `The name has not been provided!`
    const goodbay = username? `Thank you for using File Manager, ${username}, goodbye!`: `Thank you for using File Manager!`
    console.log(greeting);
    console.log(`You are currently in ${working_directory} \n`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        console.log(goodbay);
        rl.close();
        process.exit(0);
    });

    rl.on('close', () => {
        rl.close();
    })

    rl.on('line', (input) => {
        const [command_name, ...args] = input.split(' ');
        let args_filtered = args.filter(str => str.trim() !== "");
        switch (command_name){
            case "":
                if (args_filtered.length){
                    console.log("Invalid input");
                }
                break;

            case ".exit":
                rl.close();
                process.exit(0);
                break;

            case "cd":
                working_directory = cmd_cd(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "up":
                working_directory = cmd_up(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "ls":
                cmd_ls(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "cat":
                cmd_cat(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "add":
                cmd_add(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "mkdir":
                cmd_mkdir(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break

            case "rn":
                cmd_rn(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "cp":
                cmd_cp(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "mv":
                cmd_mv(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "rm":
                cmd_rm(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "hash":
                cmd_hash(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "compress":
                cmd_compress(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "decompress":
                cmd_decompress(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            case "os":
                cmd_os(working_directory, args_filtered);
                console.log(`You are currently in ${working_directory}`);
                break;

            default:
                console.log("Invalid input");
        }


    });



    // const command = () => {
    //     return new Promise((resolve) => {
    //         // rl.question(`You are currently in ${working_directory} \n`, resolve);
    //     });
    // };
    //
    // (async function () {
    //     let exit_flag = false;
    //     for (; !exit_flag;) {
    //         const input = await command();
    //         const [command_name, ...args] = input.trim().split(' ');
    //         let args_filtered = args.filter(str => str.trim() !== "")
    //
    //         switch (command_name){
    //             case "":
    //                 break;
    //
    //             case ".exit":
    //                 exit_flag = true;
    //                 break;
    //
    //             case "cd":
    //                 working_directory = cmd_cd(working_directory, args_filtered);
    //                 break;
    //
    //             case "up":
    //                 working_directory = cmd_up(working_directory, args_filtered);
    //                 break;
    //
    //             case "ls":
    //                 await cmd_ls(working_directory, args_filtered);
    //                 break;
    //
    //             case "cat":
    //                 await cmd_cat(working_directory, args_filtered);
    //                 break;
    //
    //             case "add":
    //                 await cmd_add(working_directory, args_filtered);
    //                 break;
    //
    //             case "rn":
    //                 await cmd_rn(working_directory, args_filtered);
    //                 break;
    //
    //             case "cp":
    //                 await cmd_cp(working_directory, args_filtered);
    //                 break;
    //
    //             case "mv":
    //                 await cmd_mv(working_directory, args_filtered);
    //                 break;
    //
    //             case "rm":
    //                 await cmd_rm(working_directory, args_filtered);
    //                 break;
    //
    //             case "hash":
    //                 await cmd_hash(working_directory, args_filtered);
    //                 break;
    //
    //             case "compress":
    //                 await cmd_compress(working_directory, args_filtered);
    //                 break;
    //
    //             case "decompress":
    //                 await cmd_decompress(working_directory, args_filtered);
    //                 break;
    //
    //             case "os":
    //                 await cmd_os(working_directory, args_filtered);
    //                 break;
    //
    //             default:
    //                 console.log("Invalid input");
    //         }
    //     }
    //
    //     console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    //     rl.close();
    //     process.exit(0);
    // })();

}

main_loop();