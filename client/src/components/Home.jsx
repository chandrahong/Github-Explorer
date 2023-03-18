import React, {Fragment, useEffect, useState} from 'react'
import Navbar from './Navbar'
import Content from './Content'
import useUserApiData from './Hooks/useUserApiData'
import '../css/Loading.css'
import '../css/Navbar.css'

const Home = () => {

  //loading if we dont have userdata
  const {loading} = useUserApiData()

  return (
    <Fragment>
        <div className='Home-Page'>
          {loading && 
                <div className="loading-background">
                    <span className='loader'></span>
                </div>
          }   
          <Navbar />
          <Content />
        </div>
    </Fragment>
  )
  
}

export default Home