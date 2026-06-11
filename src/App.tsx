import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import PokedexPage from '@/pages/PokedexPage';
import PokeCardPage from '@/pages/PokeCardPage';
import QuizPage from '@/pages/QuizPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/pokecard/:id" element={<PokeCardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
