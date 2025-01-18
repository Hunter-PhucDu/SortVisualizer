import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MergeSortVisualizer from './components/MergeSortVisualizer'
import BubbleSortVisualizer from './components/BubbleSortVisualizer'
import InsertionSortVisualizer from './components/InsertionSortVisualizer'
 
function App() {

  return (
    <>
      <h1>Mô phỏng thuật toán sắp xếp chèn (Insertion Sort)</h1>
      <div>
        <InsertionSortVisualizer />
      </div>
    </>
  )
}

export default App
