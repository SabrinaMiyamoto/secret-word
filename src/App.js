import { useCallback, useEffect, useState } from 'react';
import { wordsList } from './data/words';
import './App.css';
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

const stages = [
  {id: 1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'}
];

const guessesNumber = 5;

function App() {

  const [gameState, setGameState] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesNumber)
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }

  }, [words])

  const startGame = useCallback(() => {

    clearLettersStates();

    const { word, category } = pickWordAndCategory();

    let wordsLetters = word.split('');
    wordsLetters = wordsLetters.map((l) => l.toLowerCase())


    setPickedWord(word);
    setPickedCategory(category)
    setLetters(wordsLetters)

    setGameState(stages[1].name)
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();
    if(guessedLetters.includes (normalizedLetter) || wrongLetters.includes(normalizedLetter))
    {
      return;
    }
    if (letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses -1)
    }
  } 

  const clearLettersStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }
    useEffect(() => {
      if(guesses <= 0){
        setGameState(stages[2].name)
        clearLettersStates();
      }
    }, [guesses]);

    useEffect (() => {

      const uniqueLetters = [...new Set(letters)]

      if(guessedLetters.length === uniqueLetters.length){
        setScore((actualScore) => (actualScore += 100))
        startGame();
      } 
    },[guessedLetters, letters, startGame])



  const retry = () => {
    setScore(0)
    setGuesses(guessesNumber)
    setGameState(stages[0].name)
  }

  return (
    <div className="App">
      {gameState === 'start' && <StartScreen startGame={ startGame } />}
      {gameState === 'game' && <Game verifyLetter = { verifyLetter }  pickedCategory={pickedCategory} pickedWord={pickedWord}
      letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameState === 'end' && <GameOver retry={ retry } score={score}/>}
    </div>
  );
}

export default App;
