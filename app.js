const { init } = require('arweave');
const fs = require('fs');

const arweave = init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

const array = fs.readFileSync('keywords.txt').toString().split("\n").join("|");
const regex = new RegExp(`^(${array})`, 'gmi');

const generator = async () => {
    arweave.wallets.generate().then(async (key) => {
        await arweave.wallets.jwkToAddress(key).then((address) => {
            key.address = address;
            console.log(key.address);
            regex.test(key.address) ?
                fs.writeFileSync("./wallet/" +key.address + '.json', JSON.stringify(key, null, 2)) & generator()
                : generator();
        });
    });
}

generator();