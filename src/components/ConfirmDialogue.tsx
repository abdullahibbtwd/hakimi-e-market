import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


interface ConfirmDialogueProps {
    open: boolean;
    handleClose: () => void;
    handleUpdate:(order:string)=> void;
    order:string
  }

const ConfirmDialogue: React.FC<ConfirmDialogueProps> = ({
    open, 
    handleClose, 
    handleUpdate,
    order
}) => {
  return (
    <div>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you Recieved your order?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={()=>handleUpdate(order)} 
            color="success"
            autoFocus
          >
           Yes I Recieved
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmDialogue