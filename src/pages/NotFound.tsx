import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function NotFound() {
  return (
    <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ background: "#e1e2fe" }}
            minHeight={"100vh"}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={{ xs: "100vw", md: "450px" }}
                py={"2rem"}
                px={"1.5rem"}
                borderRadius={"2rem"}
                bgcolor={"#ffff"}
                gap={"1.5rem"}
                sx={{ backdropFilter: "blur(5px)" }}
            >
                <Typography variant='h4'color={"#2e5596"} fontWeight={"bold"} >404 Not Found</Typography>
                <Typography variant='h4'color={"#2e5596"} fontWeight={"bold"} >ไม่พบหน้า</Typography>
                <Button variant='contained' color='primary' onClick={() => window.location.href = "/"}>กลับสู่หน้าหลัก</Button>
            </Box>
        </Box>
  )
}
