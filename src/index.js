const enti = require('./codici_ente.json');
const TeleBot = require('telebot');
const fetch = require('node-fetch');

const bot = new TeleBot({
  token: '', // Inserire Token
});

function searchCity (city) {
  const msg = this;
  return city.descrizione_ente == msg;
}

bot.on('text', (msg) => {
  const city = enti.find(searchCity, msg.text);
  const {codice_comparto, codice_ente} = city;
  const myHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Accept": "Application/json",
    "X-Requested-With": "XMLHttpRequest"
  };
  const myInit = { method: 'POST',
               body: `codicecomparto=${codice_comparto}&codiceente=${codice_ente}`,
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

  fetch('http://soldipubblici.gov.it/it/ricerca', myInit)
    .then((res) => {
      return res.json()
    })
    .then((res) => res.data.find((res) => res.codice_siope === "2.02.03.02.002"))
    .then((res) => msg.reply.text(`${res.importo_2017/100}`))
});

bot.start();
