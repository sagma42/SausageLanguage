import React, { useContext, useState, useMemo } from 'react';
import { WordContext } from '../contexts/WordContext';
import WordItem from '../components/WordItem';
import '../styles/Home.css';

function Home() {
  const { words, savedWords, loading } = useContext(WordContext);  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('new-old');

  const filtered = useMemo(() => {
    let list = [...words];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.main.toLowerCase().includes(s) ||
          w.lang2.toLowerCase().includes(s) ||
          w.lang3.toLowerCase().includes(s) ||
          (w.description && w.description.toLowerCase().includes(s))
      );
    }
    switch (filter) {
      case 'new-old':
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'old-new':
        list.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'most-liked':
        list.sort((a, b) => b.likes - a.likes);
        break;
      case 'saved':
        list = list.filter((w) => savedWords.includes(w.id));
        break;
      case 'random':
        list.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    return list;
  }, [words, search, filter, savedWords]);

  return (
    <div className="home">
      <h1 className="title">Sosis Dili</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Sosis Dili ve Edebiyatı"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="filters">
        {[
          { key: 'new-old', label: 'Yeni→Eski' },
          { key: 'old-new', label: 'Eski→Yeni' },
          { key: 'most-liked', label: 'En Çok Beğenilen' },
          { key: 'saved', label: 'Kaydedilenler' },
          { key: 'random', label: 'Rastgele' },
        ].map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? 'active' : ''}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="word-list">
        {loading && <p>Loading words...</p>}
        {!loading && filtered.map((w) => (
          <WordItem key={w.id} word={w} />
        ))}
        {!loading && filtered.length === 0 && <p>No words found.</p>}
      </div>
      <a
        className="discord-link"
        href="https://discord.gg/yJqyHxazZq"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/discord.svg"
          alt="Discord"
          width="40"
        />
      </a>
    </div>
  );
}

export default Home;
