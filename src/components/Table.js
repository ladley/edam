import React from 'react';

import styled from 'styled-components'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { db , auth} from '../firebase';

export default function DenseTable({classBill, month, year, targetId }) {  
  const [bankAccount, setbankAccount] = React.useState('')

  React.useEffect(() => {
    getAcademyInfo()
  }, [])
  const getAcademyInfo = async () => {
    const academyRes = await db.collection('Academy').where('admins', 'array-contains',auth.currentUser.uid).get()
    if(academyRes.docs.length) {      
      academyRes.forEach((doc) => {
        setbankAccount(doc.data().bankAccount)
      })
    }
  }
  const [billId, setBillId] = React.useState('')
  const [billPrice, setBillPrice] = React.useState(0)
  const [isAddMode, setIsAddMode] = React.useState(false)
  const [materials, setMaterials] = React.useState([])
  const [isPaid, setIsPaid] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState('cash')
  const [addMaterialData, setAddMaterialData] = React.useState({
    name: '',
    price: 0,
    each: 0,
    month,
    year,
    student: undefined
  })

  React.useEffect(() => {
    fetchMaterials()
    fetchBillInformation()
  }, [targetId, month, year])

  React.useEffect(() => {
    setAddMaterialData(prev => ({
      ...prev,
      month,
      year
    }))
  }, [month])

  // React.useEffect(() => {
  //   updateBill()
  // }, [billPrice, isPaid, paymentMethod])

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
      if (!targetId || !year || !month) return
      const res = await db.collection('Material')
        .where('student', '==', db.collection('Student').doc(targetId))
        .where('year', '==', year)
        .where('month', '==', month)
        .get()
      res.docs.forEach(item =>
        setMaterials(prev => [...prev, item.data()])
      )
      // console.log(res.data().forEach(item => console.log(item)))
      // res.forEach(item => console.log(item))

    } catch(e) {
      console.error(e)
    }
  }

  const fetchBillInformation = async () => {
    if (!targetId || !year || !month) return

    const res = await db.collection('Bill')
      .where('student', '==', db.collection('Student').doc(targetId))
      .where('year', '==', year)
      .where('month', '==', month)
      .get()
    if (!res.empty) {
      setBillId(res.docs[0].id)
      const billInfo = res.docs[0].data()
      setIsPaid(billInfo.isPaid)
      setPaymentMethod(billInfo.paymentMethod)
    } else {
      const res = await db.collection('Bill').add({
        billPrice,
        month,
        year,
        student: db.collection('Student').doc(targetId),
        paymentMethod: 'card',
        isPaid: false,
      })
      setIsPaid(false)
      setPaymentMethod('card')
      setBillId(res.id)
    }
  }

  const handleAddMaterial = async () => {
    try {
      const res = await db.collection('Material').add({})
      const id = res.id
      console.log(id)
      await db.collection('Material').doc(id).set({
        ...addMaterialData,
        id: res.id,
        student: db.collection('Student').doc(targetId)
      })
      if (res) addSuccess()
    } catch (err) {
      console.error('error occured above adding material:', err)
    }
  }

  const updateBill = async () => {
    try {
      if(!billId) return
      await db.collection('Bill').doc(billId).update({
        billPrice,
        month,
        year,
        isPaid,
        paymentMethod,
        student: db.collection('Student').doc(targetId)
      })
    } catch (err) {
      console.error(err)
    }
  }

  const addSuccess = async () => {
    setAddMaterialData({
      name: '',
      price: 0,
      each: 0,
      month, year
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
            <TableCell align="right" className='hide-on-capture'>&nbsp;</TableCell>
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
              <TableCell align="right">{Number(row.price.toLocaleString('ko-KR'))}</TableCell>
              <TableCell align="right">{row.each}</TableCell>
              <TableCell align="right">{(row.each * row.price).toLocaleString('ko-KR')}</TableCell>
              <TableCell align="right" className='hide-on-capture'>
                <ClickableIconWrap hoverColor='#ed2525'
                  onClick={() => handleDeleteItem(row.id)}
                >
                  <RemoveIcon />
                </ClickableIconWrap>
              </TableCell>
            </TableRow>
          ))}
          { isAddMode &&
            <TableRow className='hide-on-capture'>
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
                  type="number"
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
                  type="number"

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
        className="hide-on-capture"
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
          {bankAccount}
        </h4>
        <h2>총액: {billPrice.toLocaleString('ko-KR')}</h2>
      </div>
      <div
                className='hide-on-capture'

      >
        <FormGroup
        >
          <FormControlLabel control={<Checkbox checked={isPaid} onClick={() => setIsPaid(!isPaid)} />} label="결제완료" />
          { isPaid &&
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">결제수단</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={paymentMethod}
                name="radio-buttons-group"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="card" control={<Radio />} label="카드" />
                <FormControlLabel value="cash" control={<Radio />} label="현금" />
                <FormControlLabel value="zeroPay" control={<Radio />} label="제로페이" />
              </RadioGroup>
            </FormControl>
          }
          <Button variant='outlined' onClick={() => updateBill()}>
            결제정보 저장하기
          </Button>
        </FormGroup>
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