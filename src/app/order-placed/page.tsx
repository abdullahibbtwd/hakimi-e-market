'use client'
import { GiCheckMark } from 'react-icons/gi'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const OrderPlaced = () => {

  const { router } = useAppContext()

  useEffect(() => {
    setTimeout(() => {
      router.push('/my-orders')
    }, 5000)
  }, [])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative ">
       <GiCheckMark className='absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-3xl text-green-900'/>
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
    </div>
  )
}

export default OrderPlaced