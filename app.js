import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const PORT = 4040 || process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

con.connect(err => {
    if (err) throw err;
    console.log("Database Connected")
});

//index page
app.get('/', (req, res) => {
    res.sendFile(--YourFile--);
});

//request page
app.post('/', (req, res) => {
    const { originalLink } = req.body;

    let shortLink =
        originalLink[8] +
        Date.now().toString().substr(9, 4) +
        originalLink[originalLink.length - 2];

        //right-alt + , == ``
    const query = `INSERT INTO --YourTable-- (--OriginalLink--, --ShortenedLink--) VALUES ('${originalLink}', '${shortLink}')`;
    con.query(query, (err, result) => {
        if (err) throw err;
    });

    res.json({ shortLink });
});

//prove result
app.get('/:link_short', (req, res) => {
    const { link_short } = req.params;
    con.query(
        `SELECT * FROM --YourTable-- WHERE --ShortenedLink-- = '${link_short}'`,
        (err, result, fields) => {
            if (err) throw err;
            if (result.length > 0) return res.redirect(result[0].link_original);
        }
    );
});

app.listen(PORT, () => console.log(`Express.js working on ${PORT}`));
