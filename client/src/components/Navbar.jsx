import React, {Fragment, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SelectUser } from '../redux/reducers/userSlice'
import LeftSideBar from './LeftSideBar'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import {AiOutlineMenu} from 'react-icons/ai'
import {HiSearch} from 'react-icons/hi'
import {AiFillGithub} from 'react-icons/ai'
import {FaTimes} from 'react-icons/fa'
import {TiThMenu} from 'react-icons/ti'
import '../css/Navbar.css'
import SearchSideBar from '../searchPages/SearchSideBar'


const Navbar = (type) => {
  const userdata = useSelector(SelectUser);
  const [rerender, setRerender] = useState(false)
  const [profilemenu, setProfileMenu] = useState(false)
  const [filtermenu, setFilterMenu] = useState(false)

  const avatar_url = localStorage.getItem("avatar_url")
  const [query, setQuery] = useState('')
  const history = useNavigate()

  function handleHover(){
    setProfileMenu(true)
  }

  function handleLeave(){
    setProfileMenu(false)
  }

  function handleLogout(){
    localStorage.removeItem("accessToken");
    setRerender(!rerender)
    history("/")
    window.location.reload();
  }

  function handleProfile(event){
    event.preventDefault();
    window.open(userdata.html_url);
  }
  
  function handleRepo(event){
    event.preventDefault();
    window.open(userdata.html_url+"?tab=repositories");
  }

  const handleHome = () =>{
    history('/Home');
    window.location.reload();
  }

  const handleSubmit = (event) =>{
    event.preventDefault();
    window.location.href = `/search/?q=${query}`;
  }
  
  function handleMenu(){
    setFilterMenu(!filtermenu)
  }

  function handleMenuLeave(){
    setFilterMenu(false)
  }
  return (
    <Fragment>
        <div className="navbar">
            <div className='mobile-navbar'>
              {filtermenu ? <FaTimes id="times-icon" onClick={() => setFilterMenu(false)}/> : <TiThMenu id="menu-icons" onClick={handleMenu} />}
              {filtermenu &&
                <div className="filter-container" onMouseLeave={handleMenuLeave}>
                  <div className="search-filter">
                    <form className='form-search' action={`/search/?q=${query}`} method="GET" onSubmit={handleSubmit}>
                      <input id="search-box"type="text" placeholder="Search or jump to..." onChange={(e) => setQuery(e.target.value)}/>
                      <button type="submit" className="search-btn"><HiSearch  id="search-hi"/></button>
                    </form>
                    
                  </div>
                  {type.type === "search" ? <SearchSideBar /> :
                    <LeftSideBar />
                  }
                </div>
              }
            </div>
            <div className="github-nav">
              <AiFillGithub id="github-icons" onClick={() => handleHome()}/>
            </div>

            <div className="nav">
              <div className="nav-content">
                <form className='form-search' action={`/search/?q=${query}`} method="GET" onSubmit={handleSubmit}>
                  <input id="search-box"type="text" placeholder="Search or jump to..." onChange={(e) => setQuery(e.target.value)}/>
                  <button type="submit" className="search-btn"><HiSearch  id="search-hi"/></button>
                </form>
              </div>
          
              {userdata &&
                <Fragment>
                  <div className="nav-right">
                    <img 
                      id="avatar" 
                      src={avatar_url} 
                      alt="avatar"
                      onMouseEnter={handleHover}
                      />
                    {profilemenu && 
                        <div className="profile-container" onMouseLeave={handleLeave}>
                          <div id="profile" className="profile-content">
                            <AiOutlineCloseCircle id="close" onClick={()=> setProfileMenu(false)}/>
                            <h1>Signed in as </h1>
                            <div className="userdata">
                              <img 
                                className="avatar-popup"
                                src={userdata?.avatar_url} 
                                alt="avatar"
                                onMouseEnter={handleHover}
                              />
                              <a>{userdata?.login}</a>
                            </div>
                         
                          </div>
                          <div className="profile-content" onClick={handleProfile}><a>Your Profile</a></div>
                          <div className='profile-content' onClick={handleRepo}><a>Your Repositories</a></div>
                          <div className="profile-content" onClick={handleLogout}><a>Sign Out</a></div>
                        </div>
                    }
                  </div>
                </Fragment>
              }
            </div>
        </div>
    </Fragment>
  )
}

export default Navbar