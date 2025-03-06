// pages/index.tsx
import { useState, useEffect } from 'react';
import React from "react";
import styles from '../styles/Home.module.css';
import Toast from "../components/Toast";

interface Verse {
  text: string;
  book: string;
  chapter: string;
  verse: string;
  theme: string;
}

const Home: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [filteredVerses, setFilteredVerses] = useState<Verse[]>([]);
  const [themeFilter, setThemeFilter] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);

  const [newVerse, setNewVerse] = useState<Verse>({
    text: '',
    book: '',
    chapter: '',
    verse: '',
    theme: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleShowToast = () => {
    setMessage("Texto copiado!");
    setShowToast(true);

    // Após 3 segundos, o alerta desaparecerá automaticamente
    setTimeout(() => {
      setShowToast(false);
    }, 1000); // 1000ms = 1 segundo
  };

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

  // Função para deletar um versículo com confirmação
  const handleDeleteVerse = (index: number) => {
    // Exibe a janela de confirmação
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este versículo?");

    if (confirmDelete) {
      // Deleta o versículo caso o usuário confirme
      const updatedVerses = verses.filter((_, i) => i !== index);
      setVerses(updatedVerses);
    }
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
      })
      .catch((error) => {
        console.error("Erro ao copiar o texto: ", error);
      });
  }

  const handleMouseDown = () => {
    // Espera 1 segundo antes de mostrar as opções
    setTimeout(() => {
      setShowOptions(true);
    }, 1000); // 1000ms = 1 segundo
  };

  return (
    <div>
      <header style={{ padding: '1rem' }}>
        <h1>Versículos Bíblicos</h1>
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
            type="text"
            placeholder="Capítulo"
            value={newVerse.chapter}
            onChange={(e) => setNewVerse({ ...newVerse, chapter: e.target.value })}
          />
          <input
            type="text"
            placeholder="Versículo"
            value={newVerse.verse}
            onChange={(e) => setNewVerse({ ...newVerse, verse: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tema"
            id="tema"
            list='temas'
            name='tema'
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
        <datalist id="temas">
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </datalist>
      </header>

      <main style={{ padding: '2rem' }}>
        <h2>Lista de Versículos</h2>
        <ul className={styles.ul}>
          {(themeFilter ? filteredVerses : verses).map((verse, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.reference}>{verse.text}</p>
              <p className={styles.reference}>
                <strong>{verse.book}</strong> {verse.chapter}:{verse.verse} -{' '}
                <i>{verse.theme}</i>
              </p>
              <div className={styles.buttonArea}>
                <button className={styles.button} onClick={() => handleEditVerse(index)}>Editar</button>
                <button className={styles.del} onClick={() => handleDeleteVerse(index)}>Deletar</button>
                <button className={styles.copy} onClick={() => { handleCopy(`${verse.text} - ${verse.book} ${verse.chapter}:${verse.verse}`), handleShowToast() }}>Copiar</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default Home;
