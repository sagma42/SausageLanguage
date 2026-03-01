import React, { useContext } from 'react';
import { WordContext } from '../contexts/WordContext';
import '../styles/WordItem.css';

function WordItem({ word }) {
  const { likeWord, toggleSaveWord, likedWords, savedWords } =
    useContext(WordContext);
  const liked = likedWords.includes(word.id);
  const saved = savedWords.includes(word.id);

  return (
    <div className="word-item">
      <div className="main-word">{word.main}</div>
      <div className="other-word">{word.lang2}</div>
      <div className="other-word">{word.lang3}</div>
      {word.description && <div className="description">{word.description}</div>}
      <div className="actions">
        <button onClick={() => likeWord(word.id)} disabled={liked}>
          {liked ? 'Liked' : 'Like'} ({word.likes})
        </button>
        <button onClick={() => toggleSaveWord(word.id)}>
          {saved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default WordItem;
