import './GameOver.css'
import React from 'react'

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>Fim de jogo</h1>
      <h2>A sua pontuação foi: <span>{score}</span>.</h2>
      <button onClick={retry}>Reiniciou</button>
    </div>
  )
}

export default GameOver
