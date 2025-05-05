export function is_args_correct(args){
    if (args.length > 1) {
        console.log("too many arguments");
        return false;
    }

    if (args.length === 0) {
        console.log("no any arguments passed")
        return false;
    }
    return true;
}