import React, { useState, forwardRef, useImperativeHandle, Ref } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingModalProps {}

export interface LoadingModalRef {
  setOpen: (open: boolean) => void;
}

const LoadingModal = forwardRef<LoadingModalRef, LoadingModalProps>((props, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    setOpen,
  }));

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 99999 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
});

export default LoadingModal;