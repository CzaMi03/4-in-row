const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = 5001;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create SQLite database connection
const db = new sqlite3.Database(path.join(__dirname, 'highscores.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS highscores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname TEXT NOT NULL,
                moves INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

app.use(cors());
app.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Highscore:
 *       type: object
 *       required:
 *         - nickname
 *         - moves
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the highscore
 *         nickname:
 *           type: string
 *           description: The player's nickname
 *         moves:
 *           type: integer
 *           description: Number of moves the player made to win
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the highscore was created
 */

/**
 * @swagger
 * /api/highscores:
 *   post:
 *     summary: Create a new highscore
 *     tags: [Highscores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - moves
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: The player's nickname
 *               moves:
 *                 type: integer
 *                 description: Number of moves the player made to win
 *     responses:
 *       200:
 *         description: The highscore was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Highscore'
 *       500:
 *         description: Some server error
 */
app.post('/api/highscores', (req, res) => {
    const { nickname, moves } = req.body;
    
    db.run(
        'INSERT INTO highscores (nickname, moves) VALUES (?, ?)',
        [nickname, moves],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                nickname,
                moves
            });
        }
    );
});

/**
 * @swagger
 * /api/highscores:
 *   get:
 *     summary: Retrieve the top 10 highscores
 *     tags: [Highscores]
 *     description: Returns a list of the top 10 highscores sorted by the number of moves (ascending)
 *     responses:
 *       200:
 *         description: A list of highscores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Highscore'
 *       500:
 *         description: Some server error
 */
app.get('/api/highscores', (req, res) => {
    db.all(
        'SELECT nickname, moves FROM highscores ORDER BY moves ASC LIMIT 10',
        [],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// Gracefully handle database closing on server shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying port ${port + 1}`);
        server.listen(port + 1);
    } else {
        console.error('Server error:', err);
    }
});
