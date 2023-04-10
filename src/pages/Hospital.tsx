import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'

import { axiosInstance } from "../axios/axiosInstance.js"
import { HospitalModel } from '../models/HospitalModel.js';


export default function Hospital() {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState<HospitalModel[] | null>(null)


  const column_data: GridColDef[] = [
    { field: 'hospital_code', headerName: 'Code', flex: 1 },
    { field: 'hospital_name_th', headerName: 'Name TH', flex: 1 },
    { field: 'hospital_name_en', headerName: 'Name EN', flex: 1 },
    {
      field: 'created_at', headerName: 'Created', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'hospital_id', headerName: 'Details', flex: 1, renderCell: (row) => {
        return <Box display={"flex"} flexDirection={"row"} gap={1} justifyContent={"center"} alignItems={"center"}>
          <Button fullWidth color='info' variant='contained' onClick={() => onDetailClick(row.value)}>
            Details
          </Button>
        </Box>
      }
    }
  ]

  //use effect
  useEffect(() => {
    axiosInstance.get("/hospitals/get-hospitals").then((res) => {
      if (res.status == 200) {
        setHospitals(res.data)
      }
    })
  }, [])


  const onDetailClick = (id: number) => {
    console.log(id);
  }

  return (
    <Box display={"flex"} flexDirection={"column"} p={2}>
      <Typography variant='h5'>
        โรงพยาบาล
      </Typography>
      <Divider />
      <Box pt={1.5}>
        <Button variant='contained' color='success'>
          เพิ่มโรงพยาบาล
        </Button>
      </Box>
      <Box width={"100%"} height={"70vh"} mt={3} px={1.5}>
        {hospitals && (
          <DataGrid
            rows={hospitals}
            columns={column_data}
            getRowId={(row: any) => row.hospital_id}
            components={{ Toolbar: GridToolbar }} 
            showCellVerticalBorder
            showColumnVerticalBorder
            />
        )}
      </Box>
    </Box>
  )
}
