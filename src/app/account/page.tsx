"use client"
import React from 'react'
import { addressDummyData } from '../../Data'
import { Button } from "@mui/material";
import { useAppContext } from '../../context/AppContext';


const Account: React.FC = () => {
    const {router} = useAppContext()
  return (
    <div className='flex w-full flex-col gap-2 '>
        <div className='w-full border-b-2 flex flex-col gap-3 items-center justify-center border-gray-600 pt-10 pb-5'>
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
                <h1 className='text-7xl font-semibold '>A</h1>
            </div>
            <h2 className='text-3xl font-normal'>Abdullahi Bashir</h2>
            <h2 className='text-xl font-normal'>abdullahibbtwd2019@gmail.com</h2>
        </div>
        <div className='w-full flex gap-4 flex-col '>
        <h2 className='text-3xl font-normal'>Address</h2>
            <div className='flex flex-col md:flex-row gap-5 items-center justify-between w-full bg-green-500 rounded-md p-4'>
                {addressDummyData.map((address)=>(
                    <p className='text-sm text-gray-200 md:text-xl' key={address._id}>{address.area},{address.city},{address.state}</p>
                ))}
                <Button
                          onClick={()=> router.push(`/add-address`) }
                           
                            variant="outlined"
                            sx={{
                                fontSize: '0.8rem',
                              borderColor: "white",
                              color: "white",
                              "&:hover": { backgroundColor: "darkgreen" },
                            }}
                          >
                            Change Address
                          </Button>
            </div>
        </div>
    </div>
  )
}

export default Account