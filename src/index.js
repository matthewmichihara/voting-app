var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var path = require('path');
const storage = require('node-persist');

const PORT = `${process.env.PORT}`;

app.use(bodyParser.json());

// storage
storage.init();
const votesStoreKey = 'votes';

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/results', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.get('/vote', async (req, res) => {
    const votes = await storage.getItem(votesStoreKey);
    res.send(votes);
});

app.post('/vote', async (req, res) => {
    try {
        /*
          votes: {
            'Skaffold': 1,
            'Jib': 3,
            'None of the Above': 0
          }
        */
        const votes = await storage.getItem(votesStoreKey) || {};

        const postedVotes = Object.keys(req.body);
        for (var name of postedVotes) {
            votes[name] = votes[name] ? votes[name] + 1 : 1;
        }

        await storage.setItem(votesStoreKey, votes);
        res.send(votes);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(PORT, () => console.log('Nodejs Frontend listening on port: ' + PORT + '!'));