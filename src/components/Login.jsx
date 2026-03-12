import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.email && formData.password) {
            toast.success('Access Granted');
            navigate('/dashboard');
        } else {
            toast.error('Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-10 -right-20 w-[500px] h-[500px] bg-primary-600 rounded-full blur-[120px] opacity-20"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[100px] opacity-30"
                />
                <div className="absolute top-1/4 right-10 w-32 h-32 border-[15px] border-primary-100 rounded-full opacity-40 -rotate-12" />
                <div className="absolute bottom-1/4 left-5 w-48 h-48 border-[2px] border-primary-200 rounded-full opacity-20" />
                <div className="absolute top-10 left-1/4 w-24 h-24 bg-primary-50 rounded-full opacity-30" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(41,140,119,0.08)] p-12 text-center border border-primary-50">
                    {/* Branding Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="p-3 bg-primary-50 rounded-2xl">
                            <img src={logo} alt="CDP Logo" className="h-10 w-auto object-contain" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Login</h1>

                    <form onSubmit={handleSubmit} className="space-y-10 text-left">
                        <div className="space-y-8">
                            {/* Email Input */}
                            <div className="relative group">
                                <Mail className="absolute left-0 bottom-3 h-5 w-5 text-primary-600" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@cdp.com"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-200 focus:border-primary-600 outline-none transition-all text-[14px] font-medium text-gray-900 placeholder:text-gray-300"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <Lock className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-200 focus:border-primary-600 outline-none transition-all text-[14px] font-medium text-gray-900 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-[14px] shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center uppercase tracking-widest"
                        >
                            Log In
                        </motion.button>

                    </form>
                </div>
                
                <div className="mt-8 text-center px-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mx-auto py-2 border-t border-transparent hover:border-primary-100"
                    >
                        <span>← Return to Public Requisition Portal</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
