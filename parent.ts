import { fork, ChildProcess } from 'child_process';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

async function main(): Promise<void> {
    log("main()");

    const forkPromises: Promise<void>[] = [];
    const childProcesses: ChildProcess[] = [];

    for (let i = 0; i < 5; i++) {
        const childProcess = fork('child.js');

        childProcesses[i] = childProcess;

        forkPromises[i] = new Promise(resolve => {
            childProcess.once('message', msg => {
                log('Message from child', msg);
                resolve();
            })
        });
    }

    log("child processes created");

    await sleep(2000);

    for (let i=0; i < 5; i++) {
        childProcesses[i].send(i * 1000);
    }

    log("child processes triggered");

    await Promise.all(forkPromises);

    log("child processes complete")
}

function log(message?: any, ...optionalParams: any[]): void {
    console.log((new Date()).toISOString() + " " + message, optionalParams);
}

main().catch(err => {
    console.log('Error occurred: ', err);
});
