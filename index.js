
if (require.main === module) {
    main();
}

function main() {
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Lingua del set: ', function (language) {
        rl.question('Inserire i tre caratteri del set: ', function (setID) {
            const apiURL = `https://api.scryfall.com/cards/search?q=lang:${language.toLowerCase()}+set:${setID.toLowerCase()}`;
            console.log(`fetcho da ${apiURL}...`);
            getCards(apiURL);
        });
    });

}

function getCards(url) {
    const axios = require('axios');

    axios
        .get(url).then(res => {
            const cards = res.data.data;
            console.log(`trovate ${res.data.total_cards} carte...`);
            if (Array.isArray(cards)) {
                parseCards(cards);
            }
        })
        .catch(error => {
            console.error(error);
        })

}

function parseCards(cards) {
    //Ordinamento carte
    cards.sort((a, b) => Number(a.collector_number) - Number(b.collector_number));

    //Map per tenere solo i nomi delle carte
    const cardNames = cards.map(card => {
        let name;
        if (card.card_faces) {
            return name = `${card.card_faces[0].printed_name} \\\ ${card.card_faces[1].printed_name}`
        } else {
            return name = card.printed_name;
        }
    });

    writeCardsToFile(cardNames)
}

function writeCardsToFile(cards) {
    const fs = require('fs');
    const filename = 'log.txt'
    const logger = fs.createWriteStream(filename);
    cards.forEach(card => {
        logger.write(`${card} \n`);
    });

    logger.end();
    console.log(`carte salvate su ${filename}`);
}
