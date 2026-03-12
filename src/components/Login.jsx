import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
        // Mock login
        if (formData.email && formData.password) {
            toast.success('Access Granted');
            navigate('/dashboard');
        } else {
            toast.error('Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[400px]"
            >
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Hero Header */}
                    <div className="bg-primary-600 p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10">
                            <ShieldCheck className="h-40 w-40 text-white -mr-10 -mt-10" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center mb-4">
                                <LogIn className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Management Access</h1>
                            <p className="text-primary-100 mt-2 text-[10px] font-black uppercase tracking-widest opacity-80">Secure Portal Identity</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="admin@cdp.com"
                                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-2xl outline-none transition-all text-[13px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Secret Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-2xl outline-none transition-all text-[13px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-3"
                        >
                            Authorize Entry
                            <ArrowRight className="h-4 w-4" />
                        </motion.button>

                        <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-4">
                            Protected by end-to-end proprietary encryption
                        </p>
                    </form>
                </div>
                
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors"
                    >
                        ← Back to Public Requisition
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
