import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




export default function DenseTable({ data }) {
  const [billPrice, setBillPrice] = React.useState(0)

  React.useEffect(() => {
    let price = 0
    data.map(item => {
      price += item.totalPrice
      return true
    })
    setBillPrice(price)
  }, [data])

  return (
    <TableContainer component={Paper}>
      <Table  size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell> 항목 </TableCell>
            <TableCell align="right">단가</TableCell>
            <TableCell align="right">수량</TableCell>
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
              <TableCell align="right">{row.totalPrice.toLocaleString('ko-KR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        style={{
          padding: 20,
          textAlign: 'right',
          width: '100%'
        }}
      >
        <h2>총액: {billPrice.toLocaleString('ko-KR')}</h2>
      </div>
    </TableContainer>
  );
}