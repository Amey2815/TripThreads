import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom'

const Login = () => {
  
  const [form, setform] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/auth/login`, form);
      login(response.data.user, response.data.token);
      navigate('/trips')
    }
    catch (error) {
      alert("Something went wrong, please try again later.");
    }
  }

  return (
    <div className=' h-screen bg-gradient-to-tl from-amber-400 via-yellow-100 to-amber-400 flex justify-center items-center ' >
      <form
        onSubmit={handleSubmit}
        className="bg-white min-w-md mx-auto mt-10 p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your credentials to login</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-300 transition bg-gray-50"
                type="email"
                onChange={(e) => setform({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                  Password
                </label>
              </div>
              <input
                id="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-300 transition bg-gray-50"
                type="password"
                onChange={(e) => setform({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-amber-600 hover:text-amber-700 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login;
