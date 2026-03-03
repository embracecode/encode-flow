import '@glideapps/glide-data-grid/dist/index.css'

import { DataEditor, GridCellKind, GridColumnIcon, CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState, useCallback } from 'react'
import CustomHeaderMenu from './sortComponents'

const tempDataList = new Array(100_0000).fill(0)

const tempDataPool = [
  {
    id: '001',
    name: '合一',
    age: '15',
    isOpen: true,
    hobby: ['football', 'swimming'],
    avatar: ['https://picsum.photos/400/300'],
    notes: '**This is a markdown cell**'
  },
  {
    id: '002',
    name: '合二',
    age: '18',
    isOpen: true,
    hobby: ['basketball', 'swimming'],
    avatar: ['https://picsum.photos/400/300'],
    notes: 'true'
  },
  {
    id: '003',
    name: '合三',
    age: '23',
    isOpen: false,
    hobby: ['basketball'],
    avatar: ['https://picsum.photos/400/300'],
    notes: 'true'
  },
  {
    id: '004',
    name: '合四',
    age: '25',
    isOpen: true,
    hobby: ['football', 'swimming'],
    avatar: ['https://picsum.photos/400/300'],
    notes: 'true'
  }
]

const data = tempDataList.map((item, index) => {
  const randomIndex = Math.floor(Math.random() * 4)
  const randomItem = tempDataPool[randomIndex]
  return {
    ...randomItem,
    id: `00${index}`,
    avatar: randomItem.avatar
  }
})
function CustomColumnMenu(props) {
  return (
    <div style={{ backgroundColor: 'white', padding: '8px' }}>
      <button onClick={() => props.onSortChanged('asc', true)}>升序</button>
      <button onClick={() => props.onSortChanged('desc', true)}>降序</button>
    </div>
  );
}
// Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
const columns = [
  { title: 'ID', width: 100, icon: GridColumnIcon.RowID },
  { title: '姓名', width: 100, icon: GridColumnIcon.Text },
  { title: '年龄', width: 100, },
  { title: '状态', width: 50, },
  { title: '爱好', width: 200, },
  { title: '头像', width: 200, },
  { title: '笔记', width: 200, }
]

// If fetching data is slow you can use the DataEditor ref to send updates for cells
// once data is loaded.


export default function ReactDataSource() {
  const ref = useRef(null)
  const [editorRect, setEditorRect] = useState({ width: 500, height: 300 })
  const { width, height } = editorRect
  const dataEditorRef = useRef(null)
  const [cellDatas, setCellDatas] = useState(data)


  useEffect(() => {
    const calcRect = () => {
      const outerContainerDom = ref.current.parentElement.parentElement
      if (outerContainerDom) {
        const { width, height } = outerContainerDom.getBoundingClientRect()
        setEditorRect({ width: width - 12, height: height - 12 })
      }
    }

    calcRect()

    window.addEventListener('resize', calcRect, false)

    return () => {
      window.removeEventListener('resize', calcRect, false)
    }
  }, [])
  function getData([col, row]) {
    const person = cellDatas[row]

    switch (col) {
      case 0: {
        return {
          kind: GridCellKind.RowID,
          data: person.id,
          allowOverlay: false,
          displayData: person.id
        }
      }

      case 1: {
        return {
          kind: GridCellKind.Text,
          data: person.name,
          allowOverlay: true,
          displayData: person.name,
          fieldValue: 'name'
        }
      }

      case 2: {
        return {
          kind: GridCellKind.Number,
          data: person.age,
          allowOverlay: true,
          displayData: String(person.age),
          fieldValue: 'age',
        }
      }

      case 3: {
        return {
          kind: GridCellKind.Boolean,
          data: person.isOpen,
          allowOverlay: true,
          displayData: person.isOpen,
          fieldValue: 'isOpen',
        }
      }

      case 4: {
        return {
          kind: GridCellKind.Bubble,
          data: person.hobby,
          allowOverlay: true,
          displayData: person.hobby,
          fieldValue: 'hobby',
        }
      }

      case 5: {
        return {
          kind: GridCellKind.Image,
          data: person.avatar,
          allowOverlay: true,
          displayData: person.avatar,
          fieldValue: 'avatar',
        }
      }

      case 6: {
        return {
          kind: GridCellKind.Markdown,
          data: person.notes,
          allowOverlay: true,
          displayData: person.Markdown,
          fieldValue: 'notes',
        }
      }

      default: {
        return {}
      }
    }
  }
  const getDataContent = useCallback(getData, [cellDatas])
  const handlerCellValue = useCallback((cell, newValue) => {
    const [col, row] = cell
    const newDataValue = newValue.data;
    setCellDatas(prevData => {
        // 创建一个新数组以保证不可变性，这有助于触发重新渲染
        const newData = [...prevData];
        // 更新对应行
        const updatedRow = { ...prevData[row] };
        // 更新对应列
        updatedRow[newValue.fieldValue] = newDataValue;
        newData[row] = updatedRow;
        return newData;
    })
  }, [])

  // 2. 处理批量编辑（包括填充柄拖拽产生的数据）
  const handlerCellsValue = useCallback((changes) => {
    setCellDatas(prevData => {
      const newData = prevData.map(row => ({...row})) // 浅拷贝一层，用于更新
      for (let r = 0; r < changes.length; r++) {
        const {location: [targetCol, targetRow], value} = changes[r]
        if (!newData[targetRow]) newData[targetRow] = []
        // 根据单元格类型提取数据
        newData[targetRow]= {
          ...newData[targetRow],
          [value.fieldValue]: value.data
        }
      }
      return newData;
    });
    return true; // 返回 true 表示已处理，避免 onCellEdited 被逐个调用
  }, []);
  // 处理选中数据
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const getCellsForSelection = useCallback((selection) => {
    const { x, y, width, height } = selection;
    const result = [];

    for (let row = y; row < y + height; row++) {
      const rowCells = [];
      for (let col = x; col < x + width; col++) {
        // 检查行列是否在数据范围内
        if (row < data.length && col < columns.length) {
          // 直接调用 getCellContent 获取单元格（简单但可能稍慢）
          // 或者手动构造（见下面优化注释）
          rowCells.push(getDataContent([col, row]));
        } else {
          rowCells.push(undefined); // 超出范围返回 undefined
        }
      }
      result.push(rowCells)
    }
    return result;
  }, [getDataContent, cellDatas])



  return (
    
    <div ref={ref}>
      <DataEditor
        ref={dataEditorRef}
        width={width}
        height={height}
        columns={columns.map(column => ({ ...column, menu: (props) => <CustomColumnMenu {...props} /> }))}
        getCellContent={getDataContent}
        rows={data.length}
        onCellEdited={handlerCellValue}
        onCellsEdited={handlerCellsValue}
        onPaste={true}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        rangeSelect="multi-rect"                 // 例如，允许多区域选择
        rowSelect="multi"                         // 允许多行选择
        fillHandle={true} // 启用填充柄
        getCellsForSelection={getCellsForSelection} // 实现选中的单元格复制
      />
      <div id="portal" style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999 }} />
    </div>
  )
}
