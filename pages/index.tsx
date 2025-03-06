// pages/index.tsx
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

interface Verse {
  text: string;
  book: string;
  chapter: string;
  verse: string;
  theme: string;
}

const Home = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [filteredVerses, setFilteredVerses] = useState<Verse[]>([]);
  const [themeFilter, setThemeFilter] = useState<string>('');
  const [newVerse, setNewVerse] = useState<Verse>({
    text: '',
    book: '',
    chapter: '',
    verse: '',
    theme: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Recuperar versículos salvos do localStorage
  useEffect(() => {
    const savedVerses = localStorage.getItem('verses');
    if (savedVerses) {
      setVerses(JSON.parse(savedVerses));
    }
  }, []);

  // Atualizar o localStorage sempre que os versículos mudarem
  useEffect(() => {
    localStorage.setItem('verses', JSON.stringify(verses));
  }, [verses]);

  // Função para adicionar ou editar um versículo
  const handleAddOrEditVerse = () => {
    if (newVerse.text && newVerse.book && newVerse.chapter && newVerse.verse) {
      let updatedVerses;
      if (editingIndex !== null) {
        updatedVerses = verses.map((verse, index) =>
          index === editingIndex ? newVerse : verse
        );
      } else {
        // Adiciona o versículo no início da lista (no topo)
        updatedVerses = [newVerse, ...verses];
      }
      setVerses(updatedVerses);
      setNewVerse({ text: '', book: '', chapter: '', verse: '', theme: '' });
      setEditingIndex(null); // Limpar o estado de edição
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  // Função para deletar um versículo
  const handleDeleteVerse = (index: number) => {
    const updatedVerses = verses.filter((_, i) => i !== index);
    setVerses(updatedVerses);
  };

  // Função para iniciar a edição de um versículo
  const handleEditVerse = (index: number) => {
    const verseToEdit = verses[index];
    setNewVerse(verseToEdit);
    setEditingIndex(index); // Definir o índice do versículo sendo editado
  };

  // Função para filtrar versículos por tema
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value;
    setThemeFilter(theme);
    if (theme) {
      setFilteredVerses(verses.filter((verse) => verse.theme === theme));
    } else {
      setFilteredVerses(verses);
    }
  };

  // Obter lista de temas únicos
  const themes = Array.from(new Set(verses.map((verse) => verse.theme)));

  return (
    <div>
      <header style={{ padding: '1rem', backgroundColor: '#f4f4f4' }}>
        <h1>Exibidor de Versículos Bíblicos</h1>
        <div>
          <input
            type="text"
            className={styles.texto}
            placeholder="Texto"
            value={newVerse.text}
            onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
          />
          <input
            type="text"
            placeholder="Livro"
            value={newVerse.book}
            onChange={(e) => setNewVerse({ ...newVerse, book: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capítulo"
            value={newVerse.chapter}
            onChange={(e) => setNewVerse({ ...newVerse, chapter: e.target.value })}
          />
          <input
            type="number"
            placeholder="Versículo"
            value={newVerse.verse}
            onChange={(e) => setNewVerse({ ...newVerse, verse: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tema"
            value={newVerse.theme}
            onChange={(e) => setNewVerse({ ...newVerse, theme: e.target.value })}
          />
          <button onClick={handleAddOrEditVerse}>
            {editingIndex === null ? 'Adicionar Versículo' : 'Salvar Alterações'}
          </button>
        </div>
        <div>
          <select onChange={handleFilterChange}>
            <option value="">Filtrar por Tema</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <h2>Lista de Versículos</h2>
        <ul>
          {(themeFilter ? filteredVerses : verses).map((verse, index) => (
            <li key={index}>
              <p>{verse.text}</p>
              <p>
                <strong>{verse.book}</strong> {verse.chapter}:{verse.verse} -{' '}
                <i>{verse.theme}</i>
              </p>
              <button onClick={() => handleEditVerse(index)}>Editar</button>
              <button onClick={() => handleDeleteVerse(index)}>Deletar</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
