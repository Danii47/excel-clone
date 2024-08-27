import { MouseEvent, useEffect, useRef, useState } from 'react'
import './App.css'

const WIDTH = 10
const HEIGHT = 40

function App() {
  const [table, setTable] = useState(new Array(HEIGHT).fill(null).map(() => new Array(WIDTH).fill(null)))
  const [columnWidths, setColumnWidths] = useState(Array(WIDTH).fill(100))
  const [rowHeights, setRowHeights] = useState(Array(HEIGHT).fill(21))
  const [inputSelected, setInputSelected] = useState<{ i: number, j: number }>({ i: 0, j: 0 })
  const resizingColumn = useRef<number | null>(null)
  const resizingRow = useRef<number | null>(null)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  const handleInputFocus = (i: number, j: number) => {
    if (inputSelected) {
      document.querySelectorAll("input")[inputSelected.i * WIDTH + inputSelected.j].classList.remove("is-typing")
      document.querySelectorAll("th")[inputSelected.j + 1].classList.remove("is-selected")
      document.querySelectorAll("tr")[inputSelected.i + 1].querySelectorAll("td")[0].classList.remove("is-selected")
    }
    document.querySelectorAll("th")[j + 1].classList.add("is-selected")
    document.querySelectorAll("tr")[i + 1].querySelectorAll("td")[0].classList.add("is-selected")

    const inputElement = document.querySelectorAll("input")[i * WIDTH + j]
    inputElement.focus()
    
    setInputSelected({ i, j });
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "Enter") {
      const i = inputSelected.i + 1
      if (i < HEIGHT) {
        handleInputFocus(i, inputSelected.j)
      }
    } else if (event.key === "ArrowUp") {
      const i = inputSelected.i - 1
      if (i >= 0) {
        handleInputFocus(i, inputSelected.j)
      }
    } else if (event.key === "ArrowRight") {
      const j = inputSelected.j + 1
      if (j < WIDTH) {
        handleInputFocus(inputSelected.i, j)
      }
    } else if (event.key === "ArrowLeft") {
      const j = inputSelected.j - 1
      if (j >= 0) {
        handleInputFocus(inputSelected.i, j)
      }
    }
  }

  const handleChangeCell = (event: React.ChangeEvent<HTMLInputElement>, i: number, j: number) => {
    const target = event.target
    const value = target.value

    target.classList.add("is-typing")

    const newTable = table.map(row => [...row])
    newTable[i][j] = value
    setTable(newTable)
  }

  
  
  const handleMouseDownColumn = (column: number) => {
    resizingColumn.current = column
    document.addEventListener('mousemove', handleMouseMoveColumn as unknown as EventListener)
    document.addEventListener('mouseup', handleMouseUpColumn)
  }

  const handleMouseDownRow = (row: number) => {
    resizingRow.current = row
    document.addEventListener('mousemove', handleMouseMoveRow as unknown as EventListener)
    document.addEventListener('mouseup', handleMouseUpRow)
  }

  const handleMouseMoveColumn = (e: MouseEvent) => {
    if (resizingColumn.current !== null) {
      const columnElement = document.querySelectorAll('th')[resizingColumn.current + 1]
      const newWidths = [...columnWidths]
      newWidths[resizingColumn.current] = e.clientX - columnElement.getBoundingClientRect().left
      setColumnWidths(newWidths)
    }
  }

  const handleMouseMoveRow = (e: MouseEvent) => {
    if (resizingRow.current !== null) {
      const rowElement = document.querySelectorAll('tr')[resizingRow.current + 1]
      const newHeights = [...rowHeights]
      if (e.clientY - rowElement.getBoundingClientRect().top < 21) return
      newHeights[resizingRow.current] = e.clientY - rowElement.getBoundingClientRect().top
      setRowHeights(newHeights)
    }
  }

  const handleMouseUpColumn = () => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMoveColumn as unknown as EventListener)
    document.removeEventListener('mouseup', handleMouseUpColumn)
  }

  const handleMouseUpRow = () => {
    resizingRow.current = null;
    document.removeEventListener('mousemove', handleMouseMoveRow as unknown as EventListener)
    document.removeEventListener('mouseup', handleMouseUpRow)
  }

  return (
    <div className="table-container">

      <table>
        <thead>
          <tr>
            <th></th>
            {
              new Array(WIDTH).fill(null).map((_, i) => (
                <th key={i} style={{ width: `${columnWidths[i]}px` }}>
                  {String.fromCharCode("A".charCodeAt(0) + i)}
                  <div
                    className="resize-column-div"
                    onMouseDown={() => handleMouseDownColumn(i)}
                  >
                    <div className="resize-column-div-borders"></div>
                    <div className="resize-column-div-borders"></div>
                  </div>
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            table.map((row, i) => (
              <tr key={i}>
                <td className="rows-keys" style={{ height: `${rowHeights[i]}px` }}>
                  {i + 1}
                  <div
                    className="resize-row-div"
                    onMouseDown={() => handleMouseDownRow(i)}
                  >
                    <div className="resize-row-div-borders"></div>
                    <div className="resize-row-div-borders"></div>
                  </div>
                </td>
                {
                  row.map((cell, j) => (
                    <td key={j} className="cell" style={{ width: `${columnWidths[j]}px`, height: `${rowHeights[i]}px` }}>
                      <input type="text" value={cell ?? ''} onClick={() => handleInputFocus(i, j)} onChange={(event) => handleChangeCell(event, i, j)} onDoubleClick={(event: React.MouseEvent<HTMLInputElement>) => handleChangeCell(event as unknown as React.ChangeEvent<HTMLInputElement>, i, j)} />
                      <span className="input-circle"></span>
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
