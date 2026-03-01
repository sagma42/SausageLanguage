import React, { createContext, useState, useEffect } from 'react';
import {
  subscribeToWords,
  subscribeToEkler,
  addWordToFirestore,
  removeWordFromFirestore,
  updateWordInFirestore,
  likeWordInFirestore,
  addEklerToFirestore,
  removeEklerFromFirestore,
  updateEklerInFirestore,
  likeEklerInFirestore,
  getDeviceId,
  getUserPreferences,
  setUserPreference,
} from '../services/firebase';

export const WordContext = createContext();

export function WordProvider({ children }) {
  const [words, setWords] = useState([]);
  const [ekler, setEkler] = useState([]);
  const [likedWords, setLikedWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const deviceId = getDeviceId();

  // Subscribe to words and ekler in real-time
  useEffect(() => {
    const unsubscribeWords = subscribeToWords((wordsList) => {
      setWords(wordsList);
      setLoading(false);
    });

    const unsubscribeEkler = subscribeToEkler((eklerList) => {
      setEkler(eklerList);
    });

    // Load user preferences
    const loadPreferences = async () => {
      const prefs = await getUserPreferences(deviceId);
      setLikedWords(prefs.liked || []);
      setSavedWords(prefs.saved || []);
    };
    loadPreferences();

    return () => {
      unsubscribeWords();
      unsubscribeEkler();
    };
  }, [deviceId]);

  const addWord = async (main, lang2, lang3, description) => {
    try {
      await addWordToFirestore(main, lang2, lang3, description);
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const removeWord = async (id) => {
    try {
      await removeWordFromFirestore(id);
      // Also remove from likes/saves
      const newLiked = likedWords.filter((x) => x !== id);
      const newSaved = savedWords.filter((x) => x !== id);
      setLikedWords(newLiked);
      setSavedWords(newSaved);
      await setUserPreference(deviceId, 'liked', newLiked);
      await setUserPreference(deviceId, 'saved', newSaved);
    } catch (error) {
      console.error('Error removing word:', error);
    }
  };

  const updateWord = async (id, main, lang2, lang3, description) => {
    try {
      await updateWordInFirestore(id, main, lang2, lang3, description);
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const likeWord = async (id) => {
    if (likedWords.includes(id)) return;
    try {
      await likeWordInFirestore(id);
      const newLiked = [...likedWords, id];
      setLikedWords(newLiked);
      await setUserPreference(deviceId, 'liked', newLiked);
    } catch (error) {
      console.error('Error liking word:', error);
    }
  };

  const toggleSaveWord = async (id) => {
    try {
      if (savedWords.includes(id)) {
        const newSaved = savedWords.filter((x) => x !== id);
        setSavedWords(newSaved);
        await setUserPreference(deviceId, 'saved', newSaved);
      } else {
        const newSaved = [...savedWords, id];
        setSavedWords(newSaved);
        await setUserPreference(deviceId, 'saved', newSaved);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const addEkler = async (main, lang2, lang3, description) => {
    try {
      await addEklerToFirestore(main, lang2, lang3, description);
    } catch (error) {
      console.error('Error adding ek:', error);
    }
  };

  const removeEkler = async (id) => {
    try {
      await removeEklerFromFirestore(id);
      const newLiked = likedWords.filter((x) => x !== id);
      const newSaved = savedWords.filter((x) => x !== id);
      setLikedWords(newLiked);
      setSavedWords(newSaved);
      await setUserPreference(deviceId, 'liked', newLiked);
      await setUserPreference(deviceId, 'saved', newSaved);
    } catch (error) {
      console.error('Error removing ek:', error);
    }
  };

  const updateEkler = async (id, main, lang2, lang3, description) => {
    try {
      await updateEklerInFirestore(id, main, lang2, lang3, description);
    } catch (error) {
      console.error('Error updating ek:', error);
    }
  };

  const value = {
    words,
    addWord,
    removeWord,
    updateWord,
    likeWord,
    toggleSaveWord,
    ekler,
    addEkler,
    removeEkler,
    updateEkler,
    likedWords,
    savedWords,
    loading,
  };

  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
}

