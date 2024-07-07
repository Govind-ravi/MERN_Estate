import {useSelector} from 'react-redux'
import { useRef, useState, useEffect} from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage'
import {app} from '../firebase.js'
import { ref } from 'firebase/storage';

export default function Profile() {
  const {currentUser} =useSelector((state)=> state.user)
  const fileRef = useRef('null')
  const [file, setFile] = useState(undefined)
  const [fileperc, setFileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})

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
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="ProfilePic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' />
        <p className='text-sm self-center'>
          {fileUploadError?(<span className='text-red-600'> Error in Image Upload(Size less than 2MB)</span>) : fileperc > 0 && fileperc < 100? (<span className='text-slate-600'>{`Uploading ${fileperc}%`}</span>):fileperc===100?<span className='text-green-500'>Image Uploaded Successfully!</span> :""}
        </p>
        <form>
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
            />
          </div>
          <div className="flex justify-center mb-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-80"
            >
              Update
            </button>
          </div>
          </form>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
            <button
              type="button"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign Out
            </button>
          </div>
      </div>
    </div>
  );
  
  }
