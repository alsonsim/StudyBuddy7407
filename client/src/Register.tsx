import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import TermsModal from './components/TermsModal';
import { supabase } from './lib/supabaseClient'; // adjust path if needed
import { v4 as uuidv4 } from 'uuid';

interface UserData {
  uid: string;
  name: string;
  email: string;
  faculty: string;
  major: string;
  gender: string;
  dob: string;
  avatarURL: string;
  createdAt: string;
}

const faculties = [
  'Arts & Social Sciences', 'Business', 'Computing', 'Dentistry',
  'Design & Engineering', 'Law', 'Medicine', 'Nursing', 'Science',
  'Music', 'Yong Loo Lin School of Medicine', 'Yong Siew Toh Conservatory of Music',
  'Public Health', 'Public Policy',
];

const genderOptions = ['Male', 'Female', 'Prefer not to say'] as const;

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

function Register() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [faculty, setFaculty] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!faculty) errors.faculty = 'Faculty selection is required';
    if (!major.trim()) errors.major = 'Major is required';
    if (!gender) errors.gender = 'Gender selection is required';
    if (!dob) errors.dob = 'Date of birth is required';
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!acceptedTerms) errors.terms = 'You must accept the terms and conditions';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, or GIF images are allowed');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

const uploadAvatarToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
if (uploadError) {
  console.error('Upload error:', uploadError);
  toast.error('Avatar upload failed');
  return '';
}

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

if (!data?.publicUrl) {
  console.error('Failed to get public URL');
  toast.error('Failed to get avatar URL');
  return '';
}

  return data.publicUrl;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      let avatarURL = '';
      if (avatar) {
        avatarURL = await uploadAvatarToSupabase(avatar);
      }

      const userData: UserData = {
        uid: user.uid,
        name,
        email,
        faculty,
        major,
        gender,
        dob,
        avatarURL,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      toast.success('Registration successful! Please check your email for verification.');
      await auth.signOut();
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordStrength = (pass: string): { valid: boolean; message?: string } => {
    if (pass.length < 8) return { valid: false, message: 'At least 8 characters' };
    if (!/[A-Z]/.test(pass)) return { valid: false, message: 'At least 1 uppercase letter' };
    if (!/[a-z]/.test(pass)) return { valid: false, message: 'At least 1 lowercase letter' };
    if (!/[0-9]/.test(pass)) return { valid: false, message: 'At least 1 number' };
    return { valid: true };
  };

  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans flex flex-col justify-between">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StudyBuddy
              </h2>
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-sm text-gray-500">Join StudyBuddy to start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <img
                  src={avatarPreview || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  aria-label="Profile picture preview"
                />
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-describedby="avatarHelp"
                />
                <label htmlFor="avatar" className="sr-only">Upload profile picture</label>
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="avatar" className="flex items-center space-x-1 text-xs text-indigo-600 hover:underline cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l9-9a1.5 1.5 0 00-2.121-2.121l-9 9v3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21H4a2 2 0 01-2-2V7a2 2 0 012-2h6" />
                  </svg>
                  <span>Edit Photo</span>
                </label>
                <p id="avatarHelp" className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 2MB)</p>
              </div>
            </div>

            {/* Form Inputs */}
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded text-indigo-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-invalid={!!formErrors.name}
                aria-describedby="nameError"
              />
              {formErrors.name && <p id="nameError" className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded text-indigo-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!formErrors.email}
                aria-describedby="emailError"
              />
              {formErrors.email && <p id="emailError" className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="faculty" className="sr-only">Faculty</label>
              <select
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-indigo-600"
                required
                aria-invalid={!!formErrors.faculty}
                aria-describedby="facultyError"
              >
                <option value="">Select Faculty</option>
                {faculties.map((fac, i) => (
                  <option key={i} value={fac}>{fac}</option>
                ))}
              </select>
              {formErrors.faculty && <p id="facultyError" className="text-red-500 text-xs mt-1">{formErrors.faculty}</p>}
            </div>

            <div>
              <label htmlFor="major" className="sr-only">Major</label>
              <input
                id="major"
                type="text"
                placeholder="Major"
                className="w-full p-2 border border-gray-300 rounded text-indigo-600"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
                aria-invalid={!!formErrors.major}
                aria-describedby="majorError"
              />
              {formErrors.major && <p id="majorError" className="text-red-500 text-xs mt-1">{formErrors.major}</p>}
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-700 uppercase">Gender</legend>
              <div className="flex flex-wrap gap-4">
                {genderOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={(e) => setGender(e.target.value)}
                      className="cursor-pointer appearance-none w-4 h-4 border border-gray-300 rounded-full bg-white checked:bg-indigo-600 checked:border-indigo-600 checked:ring-2 checked:ring-indigo-400 transition"
                      aria-invalid={!!formErrors.gender}
                      aria-describedby="genderError"
                    />
                    <span className="text-indigo-600">{option}</span>
                  </label>
                ))}
              </div>
              {formErrors.gender && <p id="genderError" className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
            </fieldset>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 uppercase">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-indigo-600"
                required
                aria-invalid={!!formErrors.dob}
                aria-describedby="dobError"
              />
              {formErrors.dob && <p id="dobError" className="text-red-500 text-xs mt-1">{formErrors.dob}</p>}
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded text-indigo-600 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!formErrors.password}
                  aria-describedby="passwordError passwordHelp"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-2 top-2 text-indigo-500 hover:scale-110 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {formErrors.password ? (
                <p id="passwordError" className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              ) : (
                <p id="passwordHelp" className="text-gray-500 text-xs mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="w-full p-2 border border-gray-300 rounded text-indigo-600 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-invalid={!!formErrors.confirmPassword}
                  aria-describedby="confirmPasswordError"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-2 top-2 text-indigo-500 hover:scale-110 transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {formErrors.confirmPassword && <p id="confirmPasswordError" className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer text-sm">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="cursor-pointer appearance-none w-5 h-5 border border-gray-300 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 transition peer"
                    aria-invalid={!!formErrors.terms}
                    aria-describedby="termsError"
                  />
                  <svg className="absolute top-[2px] left-[2px] w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">I agree to the <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-indigo-500 hover:underline cursor-pointer"
                >
                  Terms and Conditions
                </button>
                </span>
              </label>
              {formErrors.terms ? (
                  <p id="termsError" className="text-red-500 text-xs mt-1">{formErrors.terms}</p>
                ) : null}
            </div>
    
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}`}
              aria-busy={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center gap-3 mb-4 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudyBuddy
            </span>
          </div>
          <p className="text-sm hover:text-gray-800 transition-colors duration-300">
            Built with ❤️ for NUS students • © {new Date().getFullYear()} StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)} // this hides the modal
        onAcceptTerms={() => {
          setAcceptedTerms(true);                // checks the box
          setShowTermsModal(false);             // closes the modal!
        }}
      />
    </div>
  );
}

export default Register;