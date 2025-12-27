
import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  storedPassword?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, storedPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = storedPassword || 'admin123';
    
    if (password === correctPassword) {
      onLogin(password);
    } else {
      setError('Acesso Negado: Senha inválida.');
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gray-50 p-6 rounded-3xl mb-6 shadow-inner ring-1 ring-gray-100">
            <ShieldCheck className="text-gray-900 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 text-sm font-medium mt-3 text-center leading-relaxed">
            Identifique-se para gerenciar os <br/>sorteios da irmandade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha Administrativa</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-lg bg-gray-50/50"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black text-lg hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            ENTRAR AGORA
          </button>
        </form>
        
        {!storedPassword && (
          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] font-black text-indigo-600/50 uppercase tracking-widest">Dica de Acesso: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};
