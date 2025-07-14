const API_URL = 'http://localhost:5001/api';

async function saveHighscore(nickname, moves) {
    try {
        const response = await fetch(`${API_URL}/highscores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, moves })
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving highscore:', error);
        return null;
    }
}

async function getHighscores() {
    try {
        const response = await fetch(`${API_URL}/highscores`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching highscores:', error);
        return [];
    }
}
