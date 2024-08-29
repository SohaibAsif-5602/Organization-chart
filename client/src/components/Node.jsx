import React from 'react'
import './Node.css'
import image from '../assets/me2.jpg'

function Node({BPS,Designation,Branch}) {
  


  return (
    <div className="node-container">
       <div className='contentbody'>
        <div className='image'>
          <img src={image} alt='member' />
        </div>
        <div className='member-data'>
          <div className='data'>BPS-{BPS}</div>
          <div className='data'>{Designation}</div>
          <div className='data'>{Branch}</div>
        </div>
       </div> 
    </div>
  )
}

export default Node


