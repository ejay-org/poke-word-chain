import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-pokedex-red mb-4">
          포켓몬 끝말잇기
        </h1>
        <p className="text-gray-600 mb-6">
          포켓몬 이름으로 끝말잇기를 해보세요!
        </p>
        <div className="text-center">
          <button
            className="bg-pokedex-red hover:bg-pokedex-darkred text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Vite + React + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
