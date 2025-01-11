import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MergeSortVisualizer from './components/MergeSortVisualizer'
import BubbleSortVisualizer from './components/BubbleSortVisualizer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Mô phỏng thuật toán</h1>
      <div style={{ width: "70vw", height: "70vh" }}>
        <BubbleSortVisualizer />
      </div>
    </>
  )
}

export default App
