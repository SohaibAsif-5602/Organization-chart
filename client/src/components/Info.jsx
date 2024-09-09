import React from 'react'
import './Info.css'

function Info({BPS,Designation,Branch,image}) {
  


  return (
    <div className="node-container">
      <div className='contentbody'>
        <div className='image1'>
          <img src={image} alt='member' />
        </div>
        <div className='member-data'>
          <div className='data'>
            <div className='color1'>
              BPS
            </div>
            <div className='color2'>
              BPS-{BPS}
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
              Designation
            </div >
            <div className='color2'>  {Designation}
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
              Branch
            </div>
            <div className='color2'>
              {Branch}
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
            Contact Number
            </div>
            <div className='color2'>
              03405608766
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
            Email
            </div>
            <div className='color2'>
              SOHAIBASIF.5647@gmail.com
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
              Date of Joining
            </div>
            <div className='color2'>
              12-4-2002
            </div>
          </div>
          <div className='data'>
            <div className='color1'>
              Date of Retirement
            </div>
            <div className='color2'>
              12-4-20056
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info


