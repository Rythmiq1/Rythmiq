import React,{useEffect,useState} from 'react'

function Home() {
  const[loggedInUser,setLoggedInUser]=useState('');
  useEffect(()=>{
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  },[])
  return (
    <div>Home  Welcome {loggedInUser}</div>
  )
}

export default Home