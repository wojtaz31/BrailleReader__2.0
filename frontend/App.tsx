import { useState } from 'react';
import axios from 'axios';

//insert your backend address
const BACKEND_URL = 'http://[backend_ip_address]:1234';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async () => {
    setIsLoading(true);
    setMessage('Wysyłam polecenie do urządzenia...');
    setIsSuccess(null);
    setUserInput('');

    try {
      await axios.post(`${BACKEND_URL}/game/start`);
      setIsPlaying(true);
      setMessage('Odczytaj słowo z urządzenia i wpisz je poniżej.');
    } catch (error) {
      setMessage('Błąd połączenia z serwerem. Czy Backend i Driver działają?');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja wysyłająca odpowiedź użytkownika
  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/game/verify`, {
        user_guess: userInput,
      });

      if (response.data.correct) {
        setIsSuccess(true);
        setMessage( response.data.message);
        setIsPlaying(false); // Koniec rundy, można zagrać jeszcze raz
      } else {
        setIsSuccess(false);
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Błąd podczas sprawdzania odpowiedzi.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">

        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-slate-100">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">IoT Braille Reader</h1>
            <p className="text-slate-500 text-sm">Moduł nauki dla osób pełnosprawnych</p>
          </div>

          {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium text-center transition-all ${
                  isSuccess === true ? 'bg-green-100 text-green-700' :
                      isSuccess === false ? 'bg-red-100 text-red-700' :
                          'bg-blue-50 text-blue-700'
              }`}>
                {message}
              </div>
          )}

          {!isPlaying ? (
              <button
                  onClick={startGame}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Łączenie z maszyną...' : 'Rozpocznij nowe słowo'}
              </button>
          ) : (

              <form onSubmit={submitGuess} className="space-y-4">
                <div>
                  <label htmlFor="guess" className="block text-sm font-medium text-slate-700 mb-1">
                    Co wyświetliło urządzenie?
                  </label>
                  <input
                      id="guess"
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Wpisz odczytane słowo..."
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                  />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !userInput}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? 'Sprawdzam...' : 'Sprawdź odpowiedź'}
                </button>
              </form>
          )}

        </div>

        <div className="mt-8 text-slate-400 text-xs">
          BrailleReader <span className="text-base"> &reg; </span>
        </div>
      </div>
  );
}

export default App;