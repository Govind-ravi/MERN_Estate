import {useSelector} from 'react-redux'
import { useRef, useState, useEffect} from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage'
import {app} from '../firebase.js'
import { ref } from 'firebase/storage';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

export default function Profile() {
  const {currentUser, loading, error} =useSelector((state)=> state.user)
  const fileRef = useRef('null')
  const [file, setFile] = useState(undefined)
  const [fileperc, setFileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch();
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    

    uploadTask.on('state_changed', 
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFileperc(Math.round(progress))
      },    
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData, avatar: downloadURL})
      })
    }
  );
  }

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      })
      const data =  await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(error.message)
    }
  }

const handleDelete = async (req, res, next)=>{
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(formData)
    })
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}
const handleSignOut = async ()=>{
  try {
    dispatch(signOutUserStart());
    const res = await fetch(`/api/auth/signout`)
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message))
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="ProfilePic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' />
        <p className='text-sm self-center'>
          {fileUploadError?(<span className='text-red-600'> Error in Image Upload(Size less than 2MB)</span>) : fileperc > 0 && fileperc < 100? (<span className='text-slate-600'>{`Uploading ${fileperc}%`}</span>):fileperc===100?<span className='text-green-500'>Image Uploaded Successfully!</span> :""}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              defaultValue="CURRENT_USER_PASSWORD"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2 mb-6">
            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-80"
            >
              {loading? 'Loading..' : 'Update'}
            </button>
            <Link className='w-full py-2 px-4 text-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-80' to={'/create-listing'}>Create Listing</Link>
          </div>
          </form>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleDelete}
              type="button"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
            <button
            onClick={handleSignOut}
              type="button"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign Out
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <p className='text-sm text-red-700'>{error?error:""}</p>
            <p className='text-sm text-green-700'>{updateSuccess?"Successfully Updated!":""}</p>
          </div>

      </div>
    </div>
  );
  
  }
