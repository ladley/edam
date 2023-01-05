import React from 'react';

import styled from 'styled-components'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { db } from '../firebase'

export default function DenseTable({ classBill, month }) {
  const [billPrice, setBillPrice] = React.useState(0)
  const [isAddMode, setIsAddMode] = React.useState(false)
  const [materials, setMaterials] = React.useState([])
  const [addMaterialData, setAddMaterialData] = React.useState({
    name: '',
    price: 0,
    each: 0,
    month
  })

  React.useEffect(() => {
    fetchMaterials()
  }, [])
  React.useEffect(() => {
    setAddMaterialData(prev => ({
      ...prev,
      month
    }))
  }, [month])

  React.useEffect(() => {
    let price = Number(classBill.price * classBill.each)
    materials.map(item => {
      price += Number(item.price * item.each)
      return true
    })
    setBillPrice(price)
  }, [materials, classBill])

  const fetchMaterials = async () => {
    try {
      setMaterials([])
      const res = await db.collection('Material').get()
      res.docs.forEach(item =>
        setMaterials(prev => [...prev, item.data()])
      )
      // console.log(res.data().forEach(item => console.log(item)))
      // res.forEach(item => console.log(item))

    } catch(e) {
      console.error(e)
    }
  }

  const handleAddMaterial = async () => {
    try {
      const res = await db.collection('Material').add({})
      const id = res.id
      await db.collection('Material').doc(id).set({
        ...addMaterialData,
        id: res.id
      })
      if (res) addSuccess()
    } catch (err) {
      console.error('error occured above adding material:', err)
    }
  }

  const addSuccess = async () => {
    setAddMaterialData({
      name: '',
      price: 0,
      each: 0,
      month
    })
    setIsAddMode(false)
    fetchMaterials()
  }

  const handleDeleteItem = async (id) => {
    await db.collection('Material').doc(id).delete()
    fetchMaterials()

  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell> 항목 </TableCell>
            <TableCell align="right">단가</TableCell>
            <TableCell align="right">시간/수량</TableCell>
            <TableCell align="right">가격</TableCell>
            <TableCell align="right">&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { classBill &&
            <TableRow>
              <TableCell component="th" scope="row">
                {classBill.name}
              </TableCell>
              <TableCell align="right">{Number(classBill.price).toLocaleString('ko-KR')}</TableCell>
              <TableCell align="right">{classBill.each}</TableCell>
              <TableCell align="right">{Number(classBill.each * classBill.price).toLocaleString('ko-KR')}</TableCell>
            </TableRow>
          }
          {(materials.length !== 0) && materials?.map((row, index) => (
            <TableRow
              key={`${row.name}-${index}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.price.toLocaleString('ko-KR')}</TableCell>
              <TableCell align="right">{row.each}</TableCell>
              <TableCell align="right">{(row.each * row.price).toLocaleString('ko-KR')}</TableCell>
              <TableCell align="right">
                <ClickableIconWrap hoverColor='#ed2525'
                  onClick={() => handleDeleteItem(row.id)}
                >
                  <RemoveIcon />
                </ClickableIconWrap>
              </TableCell>
            </TableRow>
          ))}
          { isAddMode &&
            <TableRow >
              <TableCell>
                <TextField
                  label="항목명"
                  value={addMaterialData.name}
                  onChange={(e) => setAddMaterialData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  variant='standard'
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="단가"
                  value={addMaterialData.price}
                  onChange={(e) => setAddMaterialData(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                  variant='standard'
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="수량"
                  value={addMaterialData.each}
                  onChange={(e) => setAddMaterialData(prev => ({
                    ...prev,
                    each: e.target.value
                  }))}
                  variant='standard'
                />
              </TableCell>
              <TableCell align='right'>
                { Number(addMaterialData.each * addMaterialData.price).toLocaleString('ko-KR') }
              </TableCell>
              <TableCell align='center'>
                <ClickableIconWrap
                  hoverColor='#2065D1'
                   onClick={() => handleAddMaterial()}
                >
                  <AddIcon />
                </ClickableIconWrap>
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
      <AddMaterialBtn
        onClick={() => {
          setIsAddMode(!isAddMode)
        }}
      >
        <PlaylistAddIcon />
      </AddMaterialBtn>
      <div
        style={{
          padding: 20,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          // gap: 20
        }}
      >
        <h4 style={{ fontWeight: 'normal' }}>
          우리은행 1002-439-121265 (진현수)
        </h4>
        <h2>총액: {billPrice.toLocaleString('ko-KR')}</h2>
      </div>
    </TableContainer>
  );
}

const AddMaterialBtn = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: #eee;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color :#ddd;
  }
`

const ClickableIconWrap = styled.div`
  transition: all 0.2s ease;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:hover {
    background-color : ${({ hoverColor}) => hoverColor};
    color : #fff;
  }
`