const axios = require('axios');

if (require.main === module) {
    main();
}

function main() {
    const language = 'it';
    const set = 'DKA';
    const apiURL = `https://api.scryfall.com/cards/search?q=lang:${language}+set:${set}`;

    getCards(apiURL);
}

function getCards(url) {
    axios
        .get(url).then(res => {
            const cards = res.data.data;
            console.log(`trovate ${res.data.total_cards} carte`);
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
    console.log('writeCardsToFile', cards);

    const fs = require('fs');
    const logger = fs.createWriteStream('log.txt');
    cards.forEach(card => {
        logger.write(`${card} \n`);
    });

    logger.end();
}
