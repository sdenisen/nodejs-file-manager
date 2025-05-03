import os from "os";
export function cmd_os(working_directory, args){
    if (args.length > 1) {
        console.log("Too many arguments");
        return;
    }
    let os_command = args[0]

    if (os_command.startsWith("--")){
        switch (os_command){
            case "--EOL":
                console.log(JSON.stringify(os.EOL));
                break;

            case "--cpus":
                let cpus = os.cpus();
                console.log("Overall amount of CPUS", cpus.length);
                let res = [];
                cpus.forEach(item => {
                    let rate = Number(item.speed / 1000) + " GHz";
                    let model = item.model.trim();
                    res.push({ "Model": model, "Clock rate": rate });
                })
                console.table(res);
                break;

            case "--homedir":
                console.log(os.homedir());
                break;

            case "--username":
                console.log(os.userInfo().username);
                break;

            case "--architecture":
                console.log(os.arch());
                break;

            default:
                console.log("Unknown command argument.");
        }
    }


}