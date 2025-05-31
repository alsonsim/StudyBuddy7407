import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const faculties = [
  'Arts & Social Sciences', 'Business', 'Computing', 'Dentistry',
  'Design & Engineering', 'Law', 'Medicine', 'Nursing', 'Science',
  'Music', 'Yong Loo Lin School of Medicine', 'Yong Siew Toh Conservatory of Music',
  'Public Health', 'Public Policy',
];

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatarToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: formData,
    });

    const raw = await res.text();
    console.log('📦 Raw server response:', raw);

    try {
      const data = JSON.parse(raw);
      return data.imageUrl;
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      throw new Error('Upload failed: Not valid JSON');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!acceptedTerms) {
      toast.error('You must accept the terms and conditions.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      let avatarURL = '';
      if (avatar) {
        avatarURL = await uploadAvatarToServer(avatar);
      }

      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        name,
        email,
        faculty,
        major,
        gender,
        dob,
        avatarURL,
        createdAt: new Date().toISOString(),
      });

      toast.success('Registration successful!');
      await auth.signOut(); // <-- Sign out after registration
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-2 text-indigo-600">Create Account</h2>
      <p className="text-sm text-gray-500 mb-6">Let's get you started on your StudyBuddy journey.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <img
              src={avatarPreview || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <label htmlFor="avatar" className="flex items-center space-x-1 text-xs text-indigo-600 hover:underline cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l9-9a1.5 1.5 0 00-2.121-2.121l-9 9v3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21H4a2 2 0 01-2-2V7a2 2 0 012-2h6" />
            </svg>
            <span>Edit Photo</span>
          </label>
        </div>

        <input type="text" placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded text-indigo-600" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded text-indigo-600" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-indigo-600" required>
          <option value="">Select Faculty</option>
          {faculties.map((fac, i) => (
            <option key={i} value={fac}>{fac}</option>
          ))}
        </select>
        <input type="text" placeholder="Major" className="w-full p-2 border border-gray-300 rounded text-indigo-600" value={major} onChange={(e) => setMajor(e.target.value)} required />
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <span>Gender:</span>
          {['Male', 'Female', 'Prefer not to say'].map((option) => (
            <label key={option} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={(e) => setGender(e.target.value)}
                className="appearance-none w-4 h-4 border border-gray-300 rounded-full bg-white checked:bg-indigo-600 checked:border-indigo-600 checked:ring-2 checked:ring-indigo-400 transition"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 uppercase">Date of Birth (DD/MM/YYYY):</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-indigo-600" required />

        {/* Password Fields */}
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full p-2 border border-gray-300 rounded text-indigo-600 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute right-2 top-2 text-indigo-500 hover:scale-110 transition">
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative">
          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="w-full p-2 border border-gray-300 rounded text-indigo-600 pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer absolute right-2 top-2 text-indigo-500 hover:scale-110 transition">
            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Terms and Submit */}
        <label className="flex items-center space-x-2 cursor-pointer text-sm">
          <div className="relative">
            <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} className="cursor-pointer appearance-none w-5 h-5 border border-gray-300 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 transition peer" />
            <svg className="absolute top-[2px] left-[2px] w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-700">I agree to the <a href="#" className="text-indigo-500 hover:underline">Terms and Conditions</a></span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;
