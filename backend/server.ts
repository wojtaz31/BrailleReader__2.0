import express, { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import cors from 'cors';


const app = express()
app.use(cors());
const port: number = 1234

//driver IP address in backend network
const ESP_DRIVER_IP = ""

interface EspPayload {
    buff_1: string;
    buff_2: string;
}

interface GamePayload {
    user_guess: string;
}

app.use(express.json({ limit: '10mb' }))

let currentWord: string | null = null
const wordsDatabase = ["KOT", "PIES", "AUTO", "DOM", "KWIAT", "JABLKO", "ROWER"]

app.post('/game/start', async (req: Request, res: Response): Promise<void> => {
    const randomIndex = Math.floor(Math.random()*wordsDatabase.length)
    currentWord = wordsDatabase[randomIndex]

    console.log(`Wylosowano słowo ${currentWord}, następuje wysyłka na backend`)

    try {
        const response = await axios.post(`http://${ESP_DRIVER_IP}:80/display`, currentWord, {
            headers: { 'Content-Type': 'text/plain' }
        });

        if (response.status === 200){
            console.log('Słowo wyświetlone na urządzeniu')
            res.status(200).send({message : 'Słowo wyświetlone na urządzeniu, gra rozpoczęta'})
        }else {
            console.log('Błąd podczas wyświetlania słowa na urządzeniu')
            res.status(500).send({message : 'Błąd podczas wyswietlania słowa na urządzeniu'})
        }
    }
    catch (err) {
        console.error('Błąd podczas wysylanie requesta na driver:', err)
        res.status(500).json({error : 'Driver odrzucił zapytanie'})
    }
})

app.post('/game/verify', (req: Request<{}, {}, GamePayload>, res: Response): void => {
    const userGuess = req.body.user_guess

    if (!currentWord){
        res.status(400).json({error : 'Gra nie została rozpoczęta'})
        return;
    }

    if (userGuess === currentWord){
        console.log('[GRA]: Poprawne słowo wpisane przez użytkownika')
        res.status(200).json({ correct: true, message: "Brawo! Świetna robota." })
        currentWord = null
    } else {
        console.log(`[GRA] Pomyłka. Użytkownik wpisał: ${userGuess}, a powinno być: ${currentWord}`)
        res.status(200).json({ correct: false, message: `Pomyłka. Użytkownik wpisał niepoprawne slowo`, answer: currentWord })
    }

})

app.post('/ocr', (req: Request<{}, {}, EspPayload>, res: Response): void => {
    const payload = req.body

    if (!payload || !payload.buff_1 || !payload.buff_2) {
        res.status(400).send('Błąd: Brak buff_1 lub buff_2 w przesłanym JSON-ie!')
        return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] Otrzymano JSON z dwoma zdjęciami!`)

    try {
        const imageBuffer1 = Buffer.from(payload.buff_1, 'base64')
        const imageBuffer2 = Buffer.from(payload.buff_2, 'base64')

        fs.writeFileSync('zdjecie_1.jpg', imageBuffer1)
        fs.writeFileSync('zdjecie_2.jpg', imageBuffer2)

        res.status(200).send('OK, JSON przyjęty i rozpakowany!')

    } catch (err) {
        console.error('Błąd podczas dekodowania lub zapisu plików:', err)
        res.status(500).send('Błąd serwera podczas obróbki zdjęć')
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`http://0.0.0.0:${port}/ocr`)
})
