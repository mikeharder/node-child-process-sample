import { promisify } from 'util';

const sleep = promisify(setTimeout);

async function main(): Promise<void> {
    const timeout = await new Promise<number>(resolve => {
        process.once('message', message => {
            resolve(parseInt(message));
        })
    });

    await sleep(timeout);
    process.send!(timeout);
}

main().catch(err => {
    console.log('Error occurred: ', err);
});
