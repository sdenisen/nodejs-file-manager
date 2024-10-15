import path from "path";
import readline from "node:readline";
import {fileURLToPath} from "url";
import {cmd_cd, cmd_ls, cmd_up} from "./core/navigation.js";

const main_loop = () => {
    let working_directory = "";
    let username = "";
    const cli_args = process.argv.slice(2); // common line argumets

    for (let i = 0; i < cli_args.length; i++) {
        const argument = cli_args[i];
        const isFlag = argument.startsWith("--");
        if (isFlag) {
            const key_value_pair = argument.split("=")
            const key = key_value_pair[0];
            const value = key_value_pair[1];
            if ("--username" === key) {
                username = value
                console.log(`Welcome to the File Manager, ${username}!`);
            }
            i++;
        }
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`)
        rl.close();
        process.exit(0);
    });

    const command = () => {
        return new Promise((resolve) => {
            if (!working_directory){
                const __filename = fileURLToPath(import.meta.url);
                const path_to_working_directory = path.dirname(__filename);
                rl.question(`You are currently in ${path_to_working_directory} \n`, resolve);
                working_directory = path_to_working_directory;
            }
            rl.question(`You are currently in ${working_directory} \n`, resolve);
        });
    }
    (async function () {
        let exit_flag = false;
        for (; exit_flag === false;) {
            const input = await command();
            const [command_name, ...args] = input.trim().split(' ');
            let args_filtered = args.filter(str => str.trim() !== "")

            switch (command_name){
                case ".exit":
                    exit_flag = true;
                    break;

                case "cd":
                    working_directory = cmd_cd(working_directory, args_filtered);
                    break;

                case "up":
                    working_directory = cmd_up(working_directory, args_filtered);
                    break;

                case "ls":
                    await cmd_ls(working_directory, args_filtered);
                    break;


                default:
                    console.log("Invalid input");
            }
        }

        console.log(`Thank you for using File Manager, ${username}, goodbye!`)
        rl.close();
        process.exit(0);
    })();

}

main_loop();