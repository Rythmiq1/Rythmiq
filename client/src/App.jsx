import Login_signup from './pages/Login_signup';
import './App.css'
import {Route,Routes} from 'react-router-dom';
function App() {


  return (
      <div>
       <Routes>
      <Route path='/login' element={<Login_signup />}/>
      </Routes>
      </div>

  )
}

export default App
