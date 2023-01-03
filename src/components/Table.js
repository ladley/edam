import React from 'react';

import styled from 'styled-components'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export default function DenseTable({ data }) {
  const [billPrice, setBillPrice] = React.useState(0)
  
  React.useEffect(() => {
    let price = 0
    data.map(item => {
      price += item.price * item.each
      return true
    })
    setBillPrice(price)
  }, [data])

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell> 항목 </TableCell>
            <TableCell align="right">단가</TableCell>
            <TableCell align="right">시간/수량</TableCell>
            <TableCell align="right">가격</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.price.toLocaleString('ko-KR')}</TableCell>
              <TableCell align="right">{row.each}</TableCell>
              <TableCell align="right">{(row.each * row.price).toLocaleString('ko-KR')}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <AddMaterialBtn
        onClick={() => {

        }}
      >
        <PlaylistAddIcon />
      </AddMaterialBtn> */}
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