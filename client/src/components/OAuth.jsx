import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import {useDispatch} from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice.js';
import {useNavigate} from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async ()=>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            
            const result = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/route/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })
        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate('/');

        } catch (error) {
            console.log('Could not login');
        }
    }
  return (
    <div><div className="flex items-center justify-center">
    <button onClick={handleGoogleClick}
      type="button"
      className="w-full mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
    Continue With Google
    </button>
  </div></div>
  )
}
