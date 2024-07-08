import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UserListing from './pages/UserListing'

export default function App() {
  return <BrowserRouter>
  <Header />
  <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/about' element={<About/>} />
    <Route path='/signup' element={<SignUp/>} />
    <Route path='/sign-in' element={<SignIn/>} />
    <Route element={<PrivateRoute/>} >
     <Route path='/profile' element={<Profile/>} />
     <Route path='/create-listing' element={<CreateListing/>} />
     <Route path='/userlistings' element={<UserListing/>}/>
    </Route>
  </Routes>
  </BrowserRouter>
}

