import React from 'react'
import moment from 'moment'

export const Header = () => {
  return (
    <div className='text-center'>
      <h1 className='text-4xl font-semibold mb-2'>OmaNews</h1>
      <p>Journalism Without Fear or Favour</p>
      <p className='mt-4'>{moment().format("dddd, MMMM D, YYYY")}</p>
    </div>
  )
}
