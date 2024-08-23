import { useState } from 'react'
import './App.css'

const WIDTH = 10
const HEIGHT = 5

function App() {
  const [table, setTable] = useState(new Array(HEIGHT).fill(null).map(() => new Array(WIDTH).fill(null)))

  const handleChangeCell = (event: React.ChangeEvent<HTMLInputElement>, i: number, j: number) => {
    const { value } = event.target
    const newTable = table.map(row => [...row])
    newTable[i][j] = value
    setTable(newTable)
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            {
              new Array(WIDTH).fill(null).map((_, i) => (
                <th key={i}>{String.fromCharCode("A".charCodeAt(0) + i)}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            table.map((row, i) => (
              <tr key={i}>
                <td className="rows-keys">{i + 1}</td>
                {
                  row.map((cell, j) => (
                    <td key={j} className="cell">
                      <input type="text" value={cell ?? ''} onChange={(event) => handleChangeCell(event, i, j)}/>
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default App
