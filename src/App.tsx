/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  User, 
  Home, 
  Search, 
  Package, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Calendar,
  FileText,
  LogOut,
  Edit3,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Types ---

type Screen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'home' 
  | 'global-dashboard'
  | 'project-list' 
  | 'project-detail' 
  | 'inventory' 
  | 'requirement-form' 
  | 'requirement-list' 
  | 'approvals';

interface Material {
  id: string;
  name: string;
  quantity: string;
  lastUpdate: string;
}

interface Requirement {
  id: string;
  name: string;
  description: string;
  quantity: string;
}

interface Approval {
  id: string;
  material: string;
  quantity: string;
  engineer: string;
  description: string;
  category: string;
  cost: string;
  priority: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// --- Mock Data ---

const MOCK_PROJECTS = [
  { id: '1', name: 'PROYECTO 1', status: 'En curso', client: 'Constructora Alfa', clientType: 'Corporativo', date: '2026-01-15' },
  { id: '2', name: 'PROYECTO 2', status: 'Pendiente', client: 'Inmobiliaria Beta', clientType: 'Corporativo', date: '2026-02-01' },
  { id: '3', name: 'PROYECTO 3', status: 'Finalizado', client: 'Gobierno Regional', clientType: 'Público', date: '2025-11-20' },
  { id: '4', name: 'RESIDENCIAL LIMA', status: 'En curso', client: 'Privado', clientType: 'Residencial', date: '2026-02-10' },
];

const MOCK_STATS = {
  projectStatus: [
    { name: 'En curso', value: 12, color: '#100a60' },
    { name: 'Pendientes', value: 5, color: '#3b32b3' },
    { name: 'Finalizados', value: 28, color: '#64748b' },
  ],
  upcomingMilestones: [
    { id: '1', title: 'Fundición Losa Nivel 3', date: '2026-02-25', project: 'PROYECTO 1' },
    { id: '2', title: 'Entrega Fase 1', date: '2026-03-05', project: 'PROYECTO 2' },
  ],
  recentReports: [
    { id: '1', title: 'Reporte Semanal de Avance', date: '2026-02-18', type: 'Avance' },
    { id: '2', title: 'Auditoría de Inventario', date: '2026-02-15', type: 'Inventario' },
  ]
};

const MOCK_INVENTORY: Record<string, Material[]> = {
  '1': [
    { id: '1', name: 'Cemento Portland', quantity: '150 sacos', lastUpdate: '2026-02-17 14:30' },
    { id: '2', name: 'Grava 3/4"', quantity: '40 m³', lastUpdate: '2026-02-17 09:15' },
    { id: '3', name: 'Ladrillo King Kong', quantity: '5000 unidades', lastUpdate: '2026-02-16 16:45' },
    { id: '4', name: 'Acero 8mm', quantity: '1500 kg', lastUpdate: '2026-02-17 11:20' },
    { id: '5', name: 'Acero 12mm', quantity: '2000 kg', lastUpdate: '2026-02-17 11:20' },
  ],
  '2': [
    { id: '1', name: 'Cemento Portland', quantity: '120 sacos', lastUpdate: '2026-02-16 09:30' },
    { id: '2', name: 'Grava 3/4"', quantity: '45 m³', lastUpdate: '2026-02-14 09:45' },
    { id: '3', name: 'Ladrillo King Kong', quantity: '5500 unidades', lastUpdate: '2026-02-17 16:55' },
    { id: '4', name: 'Acero 8mm', quantity: '1500 kg', lastUpdate: '2026-02-14 11:10' },
    { id: '5', name: 'Acero 12mm', quantity: '2400 kg', lastUpdate: '2026-02-16 08:20' },
  ],
  '3': [
    { id: '1', name: 'Cemento Portland', quantity: '90 sacos', lastUpdate: '2026-02-17 10:30' },
    { id: '2', name: 'Grava 3/4"', quantity: '48 m³', lastUpdate: '2026-02-17 08:30' },
    { id: '3', name: 'Ladrillo King Kong', quantity: '3000 unidades', lastUpdate: '2026-02-15 14:45' },
    { id: '4', name: 'Acero 8mm', quantity: '900 kg', lastUpdate: '2026-02-11 11:40' },
    { id: '5', name: 'Acero 12mm', quantity: '1200 kg', lastUpdate: '2026-02-15 13:50' },
  ],
};

const MOCK_APPROVALS: Approval[] = [
  {
    id: '1',
    material: 'Cemento Portland Tipo I',
    quantity: '200 sacos',
    engineer: 'Ing. Renato Perez',
    description: 'Se requieren 200 sacos de cemento Portland Tipo I para fundición de columnas del segundo nivel.',
    category: 'Materiales',
    cost: '$20.000',
    priority: 'Alta',
    date: '13 Feb 2026',
    status: 'pending'
  },
  {
    id: '2',
    material: 'Acero 12mm Corrugado',
    quantity: '500 kg',
    engineer: 'Ing. Renato Perez',
    description: 'Refuerzo para vigas transversales en el sector C del proyecto.',
    category: 'Materiales',
    cost: '$15.000',
    priority: 'Media',
    date: '14 Feb 2026',
    status: 'pending'
  }
];

const MOCK_CATALOG = [
  'Cemento Portland Tipo I',
  'Acero 12mm Corrugado',
  'Grava 3/4"',
  'Ladrillo King Kong',
  'Arena Fina',
  'Madera para Encofrado',
  'Pintura Látex Blanca',
];

// --- Components ---

function UserDropdown({ 
  onLogout, 
  onChangePassword, 
  size = 24, 
  containerSize = "w-10 h-10", 
  iconColor = "text-white",
  bgColor = "bg-slate-800"
}: { 
  onLogout: () => void, 
  onChangePassword: () => void, 
  size?: number, 
  containerSize?: string, 
  iconColor?: string,
  bgColor?: string
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${containerSize} ${bgColor} rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-transform active:scale-95`}
      >
        <User size={size} className={iconColor} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-20 overflow-hidden border border-slate-100"
            >
              <button 
                onClick={() => { setIsOpen(false); onChangePassword(); }}
                className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <Lock size={16} />
                Cambiar contraseña
              </button>
              <button 
                onClick={() => { setIsOpen(false); onLogout(); }}
                className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-slate-50 transition-colors"
              >
                <XCircle size={16} />
                Cerrar sesión
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
  const [catalog, setCatalog] = useState<string[]>(MOCK_CATALOG);
  const [approvalFilter, setApprovalFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const navigateTo = (screen: Screen) => setCurrentScreen(screen);

  const handleLogin = (email: string) => {
    setUser({ name: 'Renato Perez', email });
    navigateTo('home');
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo('login');
  };

  const handleAddRequirement = (req: Requirement) => {
    setRequirements([...requirements, req]);
    navigateTo('requirement-list');
  };

  const handleAddToCatalog = (item: string) => {
    if (!catalog.includes(item)) {
      setCatalog([...catalog, item]);
    }
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const handleApprovalAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: action } : a));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen onContinue={() => navigateTo('login')} />;
      case 'login': return <LoginScreen onLogin={handleLogin} onRegister={() => navigateTo('register')} onForgot={() => navigateTo('forgot-password')} onBack={() => navigateTo('welcome')} />;
      case 'register': return <RegisterScreen onBack={() => navigateTo('login')} onRegister={() => navigateTo('login')} />;
      case 'forgot-password': return <ForgotPasswordScreen onBack={() => navigateTo('login')} onUpdate={() => navigateTo('login')} />;
      case 'home': return <HomeScreen userName={user?.name || 'Usuario'} onSelectProject={() => navigateTo('project-list')} onDashboard={() => navigateTo('global-dashboard')} onLogout={handleLogout} />;
      case 'global-dashboard': return <GlobalDashboardScreen onBack={() => navigateTo('home')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      case 'project-list': return <ProjectListScreen onSelect={(id) => { setSelectedProject(id); navigateTo('project-detail'); }} onBack={() => navigateTo('home')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      case 'project-detail': return <ProjectDetailScreen projectName={MOCK_PROJECTS.find(p => p.id === selectedProject)?.name || ''} onBack={() => navigateTo('project-list')} onInventory={() => navigateTo('inventory')} onRequirement={() => navigateTo('requirement-form')} onApprovals={() => navigateTo('approvals')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      case 'inventory': return <InventoryScreen projectName={MOCK_PROJECTS.find(p => p.id === selectedProject)?.name || ''} materials={MOCK_INVENTORY[selectedProject || '1']} onBack={() => navigateTo('project-detail')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      case 'requirement-form': return (
        <RequirementFormScreen 
          projectName={MOCK_PROJECTS.find(p => p.id === selectedProject)?.name || ''} 
          catalog={catalog}
          onAdd={handleAddRequirement} 
          onAddToCatalog={handleAddToCatalog}
          onBack={() => navigateTo('project-detail')} 
          onList={() => navigateTo('requirement-list')}
          onApprovals={() => navigateTo('approvals')}
          onLogout={handleLogout}
          onChangePassword={() => navigateTo('forgot-password')}
          onHome={() => navigateTo('home')}
        />
      );
      case 'requirement-list': return (
        <RequirementListScreen 
          projectName={MOCK_PROJECTS.find(p => p.id === selectedProject)?.name || ''} 
          requirements={requirements} 
          onDelete={handleDeleteRequirement} 
          onBack={() => navigateTo('requirement-form')} 
          onNew={() => navigateTo('requirement-form')} 
          onApprovals={() => navigateTo('approvals')}
          onLogout={handleLogout} 
          onChangePassword={() => navigateTo('forgot-password')} 
          onHome={() => navigateTo('home')} 
        />
      );
      case 'approvals': return <ApprovalsScreen approvals={approvals} filter={approvalFilter} setFilter={setApprovalFilter} onAction={handleApprovalAction} onBack={() => navigateTo('project-detail')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      default: return <WelcomeScreen onContinue={() => navigateTo('login')} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Screen Components ---

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-2/3 bg-welcome-hero curved-bottom flex items-center justify-center">
        {/* Elegant building image background */}
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">¡Bienvenido!</h1>
          <p className="text-slate-600 font-medium">Para iniciar su actividad pulsa en continuar</p>
        </div>
        <div className="flex justify-end items-center gap-4">
          <span className="text-slate-400 font-semibold">Continuar</span>
          <button 
            onClick={onContinue}
            className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand-accent transition-colors"
          >
            <ArrowRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onRegister, onForgot, onBack }: { onLogin: (email: string) => void, onRegister: () => void, onForgot: () => void, onBack: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-1/3 bg-topo curved-bottom relative">
        <button onClick={onBack} className="absolute top-8 left-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 border-b-4 border-brand-primary inline-block w-fit pb-1">Inicia sesión</h2>
        
        <div className="space-y-10 flex-1">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Correo</label>
            <div className="flex items-center gap-3 border-b border-brand-primary pb-2">
              <Mail size={18} className="text-slate-400" />
              <input 
                type="email" 
                placeholder="ejemplo@gmail.com" 
                className="flex-1 outline-none text-slate-600" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Contraseña</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Lock size={18} className="text-slate-400" />
              <input type={showPass ? "text" : "password"} placeholder="Ingresa la contraseña" className="flex-1 outline-none text-slate-600" />
              <button onClick={() => setShowPass(!showPass)} className="text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-brand-primary text-brand-primary focus:ring-brand-primary" />
              Recordar contraseña
            </label>
            <button onClick={onForgot} className="text-xs font-bold text-brand-primary">¿Olvidaste la contraseña?</button>
          </div>
        </div>

        <div className="space-y-6 mt-12">
          <button 
            onClick={() => onLogin(email)}
            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-accent transition-colors"
          >
            Iniciar sesión
          </button>
          <p className="text-center text-sm font-medium text-slate-500">
            ¿No tienes cuenta? <button onClick={onRegister} className="text-brand-primary font-bold">Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onBack, onRegister }: { onBack: () => void, onRegister: () => void }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-1/4 bg-topo curved-bottom"></div>
      <div className="p-8 flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-slate-800 mb-10 border-b-4 border-brand-primary inline-block w-fit pb-1">Regístrate</h2>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Correo</label>
            <div className="flex items-center gap-3 border-b border-brand-primary pb-2">
              <Mail size={18} className="text-slate-400" />
              <input type="email" placeholder="ejemplo@gmail.com" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Número telefónico</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Phone size={18} className="text-slate-400" />
              <input type="tel" placeholder="+51 000-000-000" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Contraseña</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Lock size={18} className="text-slate-400" />
              <input type={showPass ? "text" : "password"} placeholder="Ingresa la contraseña" className="flex-1 outline-none text-slate-600" />
              <button onClick={() => setShowPass(!showPass)} className="text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Confirmar contraseña</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Lock size={18} className="text-slate-400" />
              <input type={showPass ? "text" : "password"} placeholder="Confirma tu contraseña" className="flex-1 outline-none text-slate-600" />
              <button onClick={() => setShowPass(!showPass)} className="text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <button 
            onClick={onRegister}
            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-accent transition-colors"
          >
            Crear cuenta
          </button>
          <p className="text-center text-sm font-medium text-slate-500">
            ¡Ya tengo cuenta! <button onClick={onBack} className="text-brand-primary font-bold">Iniciar sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ onBack, onUpdate }: { onBack: () => void, onUpdate: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-1/4 bg-topo curved-bottom"></div>
      <div className="p-8 flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-slate-800 mb-10 border-b-4 border-brand-primary inline-block w-fit pb-1 leading-tight">Cambia la contraseña</h2>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Correo</label>
            <div className="flex items-center gap-3 border-b border-brand-primary pb-2">
              <Mail size={18} className="text-slate-400" />
              <input type="email" placeholder="ejemplo@gmail.com" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Número telefónico</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Phone size={18} className="text-slate-400" />
              <input type="tel" placeholder="+51 000-000-000" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Contraseña</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Lock size={18} className="text-slate-400" />
              <input type="password" placeholder="Ingresa la contraseña" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Confirmar contraseña</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Lock size={18} className="text-slate-400" />
              <input type="password" placeholder="Confirma tu contraseña" className="flex-1 outline-none text-slate-600" />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <button 
            onClick={onUpdate}
            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-accent transition-colors"
          >
            Actualizar contraseña
          </button>
          <p className="text-center text-sm font-medium text-slate-500">
            ¡Ya tengo cuenta! <button onClick={onBack} className="text-brand-primary font-bold">Iniciar sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ userName, onSelectProject, onDashboard, onLogout }: { userName: string, onSelectProject: () => void, onDashboard: () => void, onLogout: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">¡Te damos la bienvenida, {userName}!</h1>
          <div className="flex flex-col items-end gap-2">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={40} className="text-slate-400" />
            </div>
            <button onClick={onLogout} className="text-red-500 font-bold text-xs flex items-center gap-1">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
        
        <p className="text-slate-600 font-bold text-lg mb-8">
          Gestiona tus obras y recursos de manera eficiente desde tu panel central.
        </p>

        <div className="grid gap-4">
          <button 
            onClick={onSelectProject}
            className="w-full py-6 bg-brand-primary text-white rounded-xl font-bold text-xl shadow-xl hover:bg-brand-accent transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            <Search size={24} /> SELECCIONAR PROYECTO
          </button>
          
          <button 
            onClick={onDashboard}
            className="w-full py-6 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold text-xl shadow-lg hover:bg-slate-50 transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            <BarChart3 size={24} /> VER DASHBOARD GLOBAL
          </button>
        </div>
      </div>
      <div className="h-1/4 bg-topo curved-top"></div>
    </div>
  );
}

function GlobalDashboardScreen({ onBack, onLogout, onChangePassword, onHome }: { onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">DASHBOARD GLOBAL</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">
        {/* Project Status Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-primary" /> Estado de Proyectos
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.projectStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {MOCK_STATS.projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-brand-primary" /> Próximos Hitos
          </h3>
          <div className="space-y-4">
            {MOCK_STATS.upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{milestone.date.split('-')[1]}</span>
                  <span className="text-lg font-bold text-brand-primary">{milestone.date.split('-')[2]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{milestone.title}</h4>
                  <p className="text-xs text-slate-500">{milestone.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-brand-primary" /> Reportes Recientes
          </h3>
          <div className="space-y-4">
            {MOCK_STATS.recentReports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-brand-primary rounded-full flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                    <p className="text-[10px] text-slate-400">{report.date} • {report.type}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-brand-primary font-bold text-sm border-2 border-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all">
            GENERAR NUEVO REPORTE
          </button>
        </div>
      </div>

      <div className="bg-topo p-6 flex justify-center curved-top shrink-0">
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function ProjectListScreen({ onSelect, onBack, onLogout, onChangePassword, onHome }: { onSelect: (id: string) => void, onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchesType = typeFilter === 'Todos' || p.clientType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">PROYECTOS</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="p-6 space-y-4 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o cliente..." 
            className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm outline-none text-slate-600 border border-slate-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Todos', 'En curso', 'Pendiente', 'Finalizado'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                  statusFilter === status 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Todos', 'Corporativo', 'Público', 'Residencial'].map(type => (
              <button 
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                  typeFilter === type 
                  ? 'bg-brand-accent text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pt-0 min-h-0">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No se encontraron proyectos</div>
        ) : (
          filteredProjects.map(project => (
            <button 
              key={project.id}
              onClick={() => onSelect(project.id)}
              className="w-full bg-white rounded-3xl p-6 shadow-sm flex flex-col items-start gap-4 hover:shadow-md transition-all border border-slate-100 text-left group"
            >
              <div className="w-full aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-slate-200 transition-colors">
                <Search size={48} />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xl font-bold text-slate-800">{project.name}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                    project.status === 'En curso' ? 'bg-indigo-100 text-brand-primary' :
                    project.status === 'Finalizado' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{project.client} • {project.date}</p>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="bg-topo p-6 flex justify-center curved-top shrink-0">
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function ProjectDetailScreen({ projectName, onBack, onInventory, onRequirement, onApprovals, onLogout, onChangePassword, onHome }: { projectName: string, onBack: () => void, onInventory: () => void, onRequirement: () => void, onApprovals: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">{projectName}</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto min-h-0">
        <div className="w-full aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 border-b-4 border-slate-200">
          <Search size={64} />
        </div>

        <div className="space-y-4 mt-4">
          <button onClick={onInventory} className="w-full py-5 bg-slate-200 text-slate-600 rounded-xl font-bold text-2xl shadow-sm hover:bg-slate-300 transition-colors">
            INVENTARIO
          </button>
          <button onClick={onRequirement} className="w-full py-5 bg-slate-200 text-slate-600 rounded-xl font-bold text-2xl shadow-sm hover:bg-slate-300 transition-colors">
            REQUERIMIENTO
          </button>
          <button onClick={onApprovals} className="w-full py-5 bg-slate-200 text-slate-600 rounded-xl font-bold text-2xl shadow-sm hover:bg-slate-300 transition-colors">
            ESTADO DE APROBACIÓN
          </button>
        </div>
      </div>

      <div className="bg-topo p-6 flex justify-center curved-top shrink-0">
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function InventoryScreen({ projectName, materials, onBack, onLogout, onChangePassword, onHome }: { projectName: string, materials: Material[], onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMaterials = (materials || []).filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">{projectName}</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
            <Package size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Inventario</h3>
            <p className="text-sm text-slate-500">Materiales de Construcción</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar materiales..." 
            className="w-full bg-slate-100 py-3 pl-12 pr-4 rounded-xl outline-none text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No se encontraron materiales</div>
          ) : (
            filteredMaterials.map(material => (
              <div key={material.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-800">{material.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Última actualización: {material.lastUpdate}</p>
                </div>
                <span className="text-xl font-bold text-slate-800">{material.quantity}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-topo p-6 flex justify-center curved-top shrink-0">
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function RequirementFormScreen({ projectName, catalog, onAdd, onAddToCatalog, onBack, onList, onApprovals, onLogout, onChangePassword, onHome }: { projectName: string, catalog: string[], onAdd: (req: Requirement) => void, onAddToCatalog: (item: string) => void, onBack: () => void, onList: () => void, onApprovals: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');

  const handleAddNew = () => {
    if (newMaterialName.trim()) {
      onAddToCatalog(newMaterialName.trim());
      setName(newMaterialName.trim());
      setNewMaterialName('');
      setIsAddingNew(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">{projectName}</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="p-6 flex-1 flex flex-col overflow-y-auto min-h-0">
        <div className="flex gap-2 mb-12 shrink-0">
          <button className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm uppercase">Nuevo requerimiento</button>
          <button onClick={onList} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm uppercase">Lista</button>
        </div>

        <div className="space-y-10 flex-1">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Nombre del material</label>
              <button 
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-[10px] font-bold text-brand-primary flex items-center gap-1 hover:underline"
              >
                <Plus size={12} />
                {isAddingNew ? 'CANCELAR' : 'NUEVO MATERIAL'}
              </button>
            </div>
            
            {isAddingNew ? (
              <div className="flex items-center gap-3 border-b border-brand-accent pb-2 animate-in fade-in slide-in-from-top-1">
                <Plus size={18} className="text-brand-accent" />
                <input 
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  type="text" 
                  placeholder="Nuevo nombre de material..." 
                  className="flex-1 outline-none text-slate-600"
                  autoFocus
                />
                <button 
                  onClick={handleAddNew}
                  className="bg-brand-accent text-white px-3 py-1 rounded-lg text-[10px] font-bold"
                >
                  AÑADIR
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-b border-brand-primary pb-2">
                <Search size={18} className="text-slate-800" />
                <select 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 outline-none text-slate-600 bg-transparent appearance-none"
                >
                  <option value="">Selecciona un material...</option>
                  {catalog.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Descripción</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <ClipboardList size={18} className="text-slate-800" />
              <input 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                type="text" 
                placeholder="Ej: Cemento Tipo I 42.5 kg" 
                className="flex-1 outline-none text-slate-600" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Cantidad</label>
            <div className="flex items-center gap-3 border-b border-slate-300 pb-2">
              <Filter size={18} className="text-slate-800" />
              <input 
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                type="text" 
                placeholder="0,1,2,3..." 
                className="flex-1 outline-none text-slate-600" 
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onAdd({ id: Math.random().toString(), name, description: desc, quantity: qty })}
          className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-accent transition-colors mt-8 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name || !qty}
        >
          Agregar al requerimiento
        </button>
      </div>

      <div className="bg-topo p-6 flex justify-center items-center gap-6 curved-top shrink-0">
        <button onClick={onApprovals} className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90">
          <CheckCircle size={24} />
        </button>
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function RequirementListScreen({ projectName, requirements, onDelete, onBack, onNew, onApprovals, onLogout, onChangePassword, onHome }: { projectName: string, requirements: Requirement[], onDelete: (id: string) => void, onBack: () => void, onNew: () => void, onApprovals: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="bg-brand-primary p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold">{projectName}</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex gap-2 mb-8 shrink-0">
          <button onClick={onNew} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm uppercase">Nuevo</button>
          <button className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm uppercase">Lista</button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
          {requirements.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">No hay materiales en la lista</div>
          ) : (
            requirements.map(req => (
              <div key={req.id} className="bg-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => onDelete(req.id)} className="text-slate-800 shrink-0">
                    <Trash2 size={24} />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-slate-800 font-bold text-sm">{req.name}</span>
                    {req.description && (
                      <span className="text-slate-500 text-[10px] leading-tight mt-0.5">{req.description}</span>
                    )}
                  </div>
                </div>
                <span className="text-slate-800 font-bold shrink-0 ml-4">{req.quantity}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-topo p-6 flex justify-center items-center gap-6 curved-top shrink-0">
        <button onClick={onApprovals} className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90">
          <CheckCircle size={24} />
        </button>
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90">
          <Home size={32} className="text-slate-800" />
        </button>
      </div>
    </div>
  );
}

function ApprovalsScreen({ approvals, filter, setFilter, onAction, onBack, onLogout, onChangePassword, onHome }: { approvals: Approval[], filter: string, setFilter: (f: any) => void, onAction: (id: string, action: any) => void, onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [view, setView] = useState<'list' | 'summary'>('list');
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const decidedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="flex-1 flex flex-col bg-brand-primary h-full overflow-hidden">
      <div className="p-6 flex items-center justify-between text-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <span className="text-2xl font-bold tracking-wider">APROBACIONES</span>
        <UserDropdown onLogout={onLogout} onChangePassword={onChangePassword} />
      </div>

      <div className="flex-1 bg-slate-50 rounded-t-[40px] p-6 space-y-6 overflow-y-auto pb-24 min-h-0">
        <div className="flex bg-slate-200 p-1 rounded-2xl shrink-0">
          <button 
            onClick={() => setView('list')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
          >
            PENDIENTES ({pendingApprovals.length})
          </button>
          <button 
            onClick={() => setView('summary')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'summary' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
          >
            RESUMEN ({decidedApprovals.length})
          </button>
        </div>

        {view === 'list' ? (
          <div className="space-y-6">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium">No hay aprobaciones pendientes</div>
            ) : (
              pendingApprovals.map(approval => (
                <div key={approval.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative">
                  <div className="absolute top-6 right-6 w-3 h-3 bg-brand-accent rounded-full animate-pulse"></div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 border border-slate-100">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold">{approval.material} - {approval.quantity}</h4>
                      <p className="text-xs text-slate-400">{approval.engineer}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {approval.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 uppercase">{approval.category}</span>
                    <span className="px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 uppercase">{approval.cost}</span>
                    <span className="px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 uppercase">{approval.priority}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-8">
                    <Clock size={14} />
                    <span>{approval.date}</span>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => onAction(approval.id, 'rejected')}
                      className="flex-1 py-3 border-2 border-red-400 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors text-sm"
                    >
                      RECHAZAR
                    </button>
                    <button 
                      onClick={() => onAction(approval.id, 'approved')}
                      className="flex-1 py-3 border-2 border-emerald-400 text-emerald-500 rounded-xl font-bold hover:bg-emerald-50 transition-colors text-sm"
                    >
                      APROBAR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cant.</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {decidedApprovals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400 text-sm">No hay decisiones tomadas</td>
                    </tr>
                  ) : (
                    decidedApprovals.map(approval => (
                      <tr key={approval.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800 text-xs">{approval.material}</div>
                          <div className="text-[10px] text-slate-400">{approval.date}</div>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-600">{approval.quantity}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${
                            approval.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {approval.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => onAction(approval.id, 'pending')}
                            className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
                            title="Modificar decisión"
                          >
                            <Edit3 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 flex justify-around items-center">
        <button onClick={onHome} className="flex flex-col items-center gap-1 text-slate-800">
          <Home size={32} />
          <span className="text-[10px] font-bold uppercase">Inicio</span>
        </button>
      </div>
    </div>
  );
}
