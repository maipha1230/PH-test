import { Box, Button, Divider, Typography, useTheme, TextField } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { HospitalModel } from '../models/Hospital.model.js';
import HospitalDialog from '../components/HospitalDialog.js';
import { ensureRemoveHospital, successAlert } from '../sweetAlert/sweetAlert.js';
import axios from 'axios';
import HospitalUserDialog from '../components/HospitalUserDialog.js';
import MUIDataTable from "mui-datatables";

export default function Hospital() {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState<HospitalModel[]>([])
  const [dialogHospital, setDialogHospital] = useState<boolean>(false)
  const [dialogUserHospital, setDialogUserHospital] = useState<boolean>(false)
  const [hostpitalId, setHostpitalId] = useState<number | null>(null)

  const columns = [
    {
      name: "hospital_code",
      label: "รหัสโรงพยาบาล",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "hospital_name_th",
      label: "ชื่อโรงพยาบาล(ไทย)",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "hospital_name_en",
      label: "ชื่อโรงพยาบาล(อังกฤษ)",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "created_at",
      label: "เข้าร่วมเมื่อ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: string) => <span>{new Date(value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}</span>
      }
    },
    {
      name: "hospital_id",
      label: "จัดการ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: number) => {
          return (
            <Box display={"flex"} flexDirection={{xs: "column", sm: "row"}} gap={1} justifyContent={"center"} alignItems={"center"} width={{xs: "100%", lg: "50%"}}>
              <Button fullWidth color='warning' variant='contained' onClick={() => onDetailClick(value)}>
                แก้ไข
              </Button>
              <Button fullWidth color='secondary' variant='contained' onClick={() => onUserInHospital(value)}>
                พนักงาน
              </Button>
              <Button fullWidth color='error' variant='contained' onClick={() => onDeleteClick(value)}>
                ลบ
              </Button>
            </Box>
          )
        }
      }
    },

  ];


  //use effect
  useEffect(() => {
    getHospitals()
  }, [dialogHospital])

  const getHospitals = () => {
    axios.get("/hospitals/get-hospitals").then((res) => {
      if (res.status == 200) {
        setHospitals(res.data)
      }
    })
  }

  const onDetailClick = (id: number) => {
    setHostpitalId(id)
    handleDialogHospitalOpen()
  }

  const onUserInHospital = (id: number) => {
    setHostpitalId(id)
    handleDialogUserHospitalOpen()
  }

  const onDeleteClick = (id: number) => {
    ensureRemoveHospital().then((check) => {
      if (check.isConfirmed) {
        axios.delete(`hospitals/remove-hospital/${id}`).then((res) => {
          if (res.status == 200) {
            successAlert(res.data).then(() => {
              getHospitals();
            })
          }
        })
      }
    })
  }

  const handleDialogHospitalOpen = () => {
    setDialogHospital(true)
  }

  const handleDialogHospitalClose = () => {
    setDialogHospital(false)
    setHostpitalId(null)
  }
  const handleDialogUserHospitalOpen = () => {
    setDialogUserHospital(true)
  }

  const handleDialogUserHospitalClose = () => {
    setDialogUserHospital(false)
    setHostpitalId(null)
  }


  return (
    <Box display={"flex"} flexDirection={"column"} p={2}>
      <Typography variant='h5'>
        โรงพยาบาล
      </Typography>
      <Divider />
      <Box pt={1.5}>
        <Button variant='contained' color='success' onClick={handleDialogHospitalOpen}>
          เพิ่มโรงพยาบาล
        </Button>
      </Box>
      <Box width={"100%"} maxWidth={"100wh"} height={"70vh"} mt={3}>
        <MUIDataTable
          title={"ตารางโรงพยาบาล"}
          data={hospitals}
          columns={columns}
          options={{ filterType: 'checkbox', }}
        />
      </Box>
      {/* dialog hospital */}
      {dialogHospital && <HospitalDialog open={dialogHospital} handleDialogClose={handleDialogHospitalClose} hospitalId={hostpitalId} />}

      {dialogUserHospital && <HospitalUserDialog open={dialogUserHospital} handleDialogClose={handleDialogUserHospitalClose} hospitalId={hostpitalId} />}

    </Box>
  )
}
