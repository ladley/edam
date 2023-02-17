import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { db, auth } from '../../firebase'

const VISIBLE_FIELDS = ['name', 'tel', 'address'];


const Column = [
    {
        field: 'id',
        headerName: 'UID',
        width: 50,
        headerAlign: 'center',
        align: 'center',
        hide: true,
        filterable: false,
    },
    {
        field: 'name',
        headerName: '학원명',
        width: 200,
        headerAlign: 'center',
        align: 'center',
        filterable: false,
    },
    {
        field: 'tel',
        headerName: '전화번호',
        minWidth: 200,
        headerAlign: 'center',
        align: 'center',

        filterable: false,
    },
    {
        field: 'address',
        headerName: '주소',
        minWidth: 250,
        headerAlign: 'center',
        align: 'center',
    },
]
export default function AcademyListTable() {
    const [academys, setAcademys] = useState([]);

    useEffect(() => {
        getAcademyList();
    }, []);

    useEffect(() => {
        console.log(academys)
    }, [academys]);

    async function getAcademyList() {
        const snapshot = await db.collection('Academy').get()
        const collection = [];
        snapshot.forEach(doc => {
            if(!isEmptyObject(doc.data()) && !isEmptyId(doc.data()))collection.push(doc.data());
        });
        setAcademys(collection);
    }

    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    function isEmptyId(obj) {
        return obj.id === undefined;
    }

    return (
        <Box sx={{ height: 350, width: 1 }}>
            <DataGrid
            // {...data}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disable
                rows=
                {academys}
                columns={Column}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
            />
        </Box>
    );
}