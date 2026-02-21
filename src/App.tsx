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
  Plus,
  Send,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Screen = 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'home' 
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
  { 
    id: '1', 
    name: 'PROYECTO 1', 
    status: 'En curso', 
    client: 'Constructora Alfa', 
    clientType: 'Corporativo', 
    date: '2026-01-15',
    imageUrl: 'https://postgrado.ucsp.edu.pe/wp-content/uploads/2020/11/conocimientos-necesario-jefe-proyectos.jpg'
  },
  { 
    id: '2', 
    name: 'PROYECTO 2', 
    status: 'Pendiente', 
    client: 'Inmobiliaria Beta', 
    clientType: 'Corporativo', 
    date: '2026-02-01',
    imageUrl: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=400&h=200&q=80'
  },
  { 
    id: '3', 
    name: 'PROYECTO 3', 
    status: 'Finalizado', 
    client: 'Gobierno Regional', 
    clientType: 'Público', 
    date: '2025-11-20',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: '4', 
    name: 'RESIDENCIAL LIMA', 
    status: 'En curso', 
    client: 'Privado', 
    clientType: 'Residencial', 
    date: '2026-02-10',
    imageUrl: 'https://media.istockphoto.com/id/1996826487/es/foto/obra-con-gr%C3%BAas-para-edificios-residenciales.jpg?s=612x612&w=0&k=20&c=nZ4nkH6P9m_h5A0kduuObylRQBwlf2PFsT151TIpS_Q='
  },
];

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
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
  const [inventory, setInventory] = useState<Record<string, Material[]>>(MOCK_INVENTORY);
  const [catalog, setCatalog] = useState<string[]>(MOCK_CATALOG);
  const [approvalFilter, setApprovalFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const handleUpdateProjectStatus = (projectId: string, newStatus: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
  };

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

  const handleApprovalAction = (id: string, action: 'approved' | 'rejected' | 'pending') => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: action } : a));
  };

  const handleUpdateInventory = (projectId: string, materialId: string, newQuantity: string) => {
    setInventory(prev => ({
      ...prev,
      [projectId]: prev[projectId].map(m => 
        m.id === materialId ? { ...m, quantity: newQuantity, lastUpdate: new Date().toLocaleString() } : m
      )
    }));
  };

  const handleAddInventory = (projectId: string, name: string, quantity: string) => {
    const newMaterial: Material = {
      id: Math.random().toString(),
      name,
      quantity,
      lastUpdate: new Date().toLocaleString()
    };
    setInventory(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newMaterial]
    }));
  };

  const handleDeleteInventory = (projectId: string, materialId: string) => {
    setInventory(prev => ({
      ...prev,
      [projectId]: prev[projectId].filter(m => m.id !== materialId)
    }));
  };

  const handleSendToApprovals = () => {
    if (requirements.length === 0) return;
    
    const newApprovals: Approval[] = requirements.map(req => ({
      id: Math.random().toString(),
      material: req.name,
      quantity: req.quantity,
      description: req.description || '',
      engineer: user?.name || 'Usuario',
      date: new Date().toLocaleDateString(),
      status: 'pending',
      category: 'General',
      cost: 'N/A',
      priority: 'Media'
    }));
    
    setApprovals([...approvals, ...newApprovals]);
    setRequirements([]);
    navigateTo('approvals');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen onContinue={() => navigateTo('login')} />;
      case 'login': return <LoginScreen onLogin={handleLogin} onRegister={() => navigateTo('register')} onForgot={() => navigateTo('forgot-password')} onBack={() => navigateTo('welcome')} />;
      case 'register': return <RegisterScreen onBack={() => navigateTo('login')} onRegister={() => navigateTo('login')} />;
      case 'forgot-password': return <ForgotPasswordScreen onBack={() => navigateTo('login')} onUpdate={() => navigateTo('login')} />;
      case 'home': return <HomeScreen userName={user?.name || 'Usuario'} onSelectProject={() => navigateTo('project-list')} onLogout={handleLogout} />;
      case 'project-list': return <ProjectListScreen projects={projects} onUpdateStatus={handleUpdateProjectStatus} onSelect={(id) => { setSelectedProject(id); navigateTo('project-detail'); }} onBack={() => navigateTo('home')} onLogout={handleLogout} onChangePassword={() => navigateTo('forgot-password')} onHome={() => navigateTo('home')} />;
      case 'project-detail': {
        const project = projects.find(p => p.id === selectedProject);
        return (
          <ProjectDetailScreen 
            projectName={project?.name || ''} 
            imageUrl={project?.imageUrl || ''}
            onBack={() => navigateTo('project-list')} 
            onInventory={() => navigateTo('inventory')} 
            onRequirement={() => navigateTo('requirement-form')} 
            onApprovals={() => navigateTo('approvals')} 
            onLogout={handleLogout} 
            onChangePassword={() => navigateTo('forgot-password')} 
            onHome={() => navigateTo('home')} 
          />
        );
      }
      case 'inventory': return (
        <InventoryScreen 
          projectName={projects.find(p => p.id === selectedProject)?.name || ''} 
          materials={inventory[selectedProject || '1'] || []} 
          onUpdate={(matId, qty) => handleUpdateInventory(selectedProject || '1', matId, qty)}
          onAdd={(name, qty) => handleAddInventory(selectedProject || '1', name, qty)}
          onDelete={(matId) => handleDeleteInventory(selectedProject || '1', matId)}
          onRequirement={() => navigateTo('requirement-form')}
          onBack={() => navigateTo('project-detail')} 
          onLogout={handleLogout} 
          onChangePassword={() => navigateTo('forgot-password')} 
          onHome={() => navigateTo('home')} 
        />
      );
      case 'requirement-form': return (
        <RequirementFormScreen 
          projectName={projects.find(p => p.id === selectedProject)?.name || ''} 
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
          projectName={projects.find(p => p.id === selectedProject)?.name || ''} 
          requirements={requirements} 
          onDelete={handleDeleteRequirement} 
          onSendToApprovals={handleSendToApprovals}
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

function HomeScreen({ userName, onSelectProject, onLogout }: { userName: string, onSelectProject: () => void, onLogout: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex flex-col mb-8">
          <div className="flex justify-end mb-4">
            <div className="flex flex-col items-end gap-2">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                <User size={40} className="text-slate-400" />
              </div>
              <button onClick={onLogout} className="text-red-500 font-bold text-xs flex items-center gap-1">
                <LogOut size={14} /> Salir
              </button>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">¡Te damos la bienvenida, {userName}!</h1>
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
        </div>
      </div>
      <div className="h-1/4 bg-topo curved-top"></div>
    </div>
  );
}

function StatusDropdown({ status, onUpdate }: { status: string, onUpdate: (newStatus: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ['En curso', 'Pendiente', 'Finalizado'];

  const getStatusStyles = (s: string) => {
    switch (s) {
      case 'En curso': return 'bg-indigo-100 text-brand-primary';
      case 'Finalizado': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 shadow-sm border border-white/50 ${getStatusStyles(status)}`}
      >
        {status}
        <ChevronDown size={12} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
            <motion.div 
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl z-20 overflow-hidden border border-slate-100"
            >
              {statuses.map(s => (
                <button 
                  key={s}
                  onClick={(e) => { e.stopPropagation(); onUpdate(s); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors flex items-center justify-between ${status === s ? 'text-brand-primary bg-slate-50/50' : 'text-slate-500'}`}
                >
                  {s}
                  {status === s && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectListScreen
({ projects, onUpdateStatus, onSelect, onBack, onLogout, onChangePassword, onHome }: { projects: any[], onUpdateStatus: (id: string, s: string) => void, onSelect: (id: string) => void, onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pt-0 min-h-0">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No se encontraron proyectos</div>
        ) : (
          filteredProjects.map(project => (
            <div 
              key={project.id}
              onClick={() => onSelect(project.id)}
              className="w-full bg-white rounded-3xl p-6 shadow-sm flex flex-col items-start gap-4 hover:shadow-md transition-all border border-slate-100 text-left group cursor-pointer"
            >
              <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden group-hover:opacity-90 transition-opacity">
                <img 
                  src={project.imageUrl} 
                  alt={project.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xl font-bold text-slate-800">{project.name}</span>
                  <StatusDropdown 
                    status={project.status} 
                    onUpdate={(newStatus) => onUpdateStatus(project.id, newStatus)} 
                  />
                </div>
                <p className="text-xs text-slate-400 font-medium">{project.client} • {project.date}</p>
              </div>
            </div>
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

function ProjectDetailScreen({ projectName, imageUrl, onBack, onInventory, onRequirement, onApprovals, onLogout, onChangePassword, onHome }: { projectName: string, imageUrl: string, onBack: () => void, onInventory: () => void, onRequirement: () => void, onApprovals: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
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
        <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border-b-4 border-slate-200">
          <img 
            src={imageUrl} 
            alt={projectName} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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

function InventoryScreen({ projectName, materials, onUpdate, onAdd, onDelete, onRequirement, onBack, onLogout, onChangePassword, onHome }: { projectName: string, materials: Material[], onUpdate: (id: string, qty: string) => void, onAdd: (name: string, qty: string) => void, onDelete: (id: string) => void, onRequirement: () => void, onBack: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'summary'>('list');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const filteredMaterials = (materials || []).filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (newName && newQty) {
      onAdd(newName, newQty);
      setNewName('');
      setNewQty('');
      setIsAdding(false);
    }
  };

  const startEditing = (m: Material) => {
    setEditingId(m.id);
    setEditValue(m.quantity);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editValue);
    setEditingId(null);
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

      <div className="p-6 space-y-6 flex-1 overflow-y-auto min-h-0 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <Package size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Inventario</h3>
              <p className="text-sm text-slate-500">Materiales de Construcción</p>
            </div>
          </div>
          <button 
            onClick={() => setView(view === 'list' ? 'summary' : 'list')}
            className="px-4 py-2 bg-slate-100 text-brand-primary rounded-xl text-xs font-bold uppercase border border-slate-200"
          >
            {view === 'list' ? 'Ver Resumen' : 'Ver Lista'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar materiales..." 
              className="w-full bg-slate-100 py-3 pl-12 pr-4 rounded-xl outline-none text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isAdding ? 'bg-red-500 text-white' : 'bg-brand-primary text-white'}`}
          >
            {isAdding ? <XCircle size={24} /> : <Plus size={24} />}
          </button>
        </div>

        {isAdding && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-slate-700 uppercase">Añadir Nuevo Material</h4>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Nombre" 
                className="bg-white p-3 rounded-xl border border-slate-200 outline-none text-sm"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Cantidad" 
                className="bg-white p-3 rounded-xl border border-slate-200 outline-none text-sm"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
              />
            </div>
            <button 
              onClick={handleAdd}
              className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold text-sm uppercase shadow-md"
            >
              Guardar en Inventario
            </button>
          </div>
        )}

        {view === 'list' ? (
          <div className="space-y-4">
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-10 text-slate-400">No se encontraron materiales</div>
            ) : (
              filteredMaterials.map(material => (
                <div key={material.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onDelete(material.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Eliminar material"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-slate-800">{material.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Actualizado: {material.lastUpdate}</p>
                    </div>
                  </div>
                  
                  {editingId === material.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        className="w-24 bg-slate-100 p-2 rounded-lg text-right font-bold text-slate-800 outline-none border border-brand-primary"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onBlur={() => saveEdit(material.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(material.id)}
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(material)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    >
                      <span className="text-xl font-bold text-slate-800">{material.quantity}</span>
                      <Edit3 size={16} className="text-slate-300 group-hover:text-brand-primary" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cantidad</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMaterials.map(material => (
                    <tr key={material.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onDelete(material.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="font-bold text-slate-800 text-xs">{material.name}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {editingId === material.id ? (
                          <input 
                            type="text" 
                            className="w-20 bg-slate-100 p-1 rounded text-xs font-bold text-slate-800 outline-none border border-brand-primary"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onBlur={() => saveEdit(material.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(material.id)}
                          />
                        ) : (
                          <div 
                            onClick={() => startEditing(material)}
                            className="text-xs font-bold text-slate-800 flex items-center gap-1 cursor-pointer"
                          >
                            {material.quantity}
                            <Edit3 size={12} className="text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-[10px] text-slate-400 text-right">{material.lastUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-topo p-6 flex justify-center items-center gap-6 curved-top shrink-0">
        <div className="w-12 h-12" /> {/* Spacer for balance */}
        <button onClick={onHome} className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90">
          <Home size={32} className="text-slate-800" />
        </button>
        <button onClick={onRequirement} className="px-4 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-90" title="Generar Requerimiento">
          <Plus size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">REQ.</span>
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

function RequirementListScreen({ projectName, requirements, onDelete, onSendToApprovals, onBack, onNew, onApprovals, onLogout, onChangePassword, onHome }: { projectName: string, requirements: Requirement[], onDelete: (id: string) => void, onSendToApprovals: () => void, onBack: () => void, onNew: () => void, onApprovals: () => void, onLogout: () => void, onChangePassword: () => void, onHome: () => void }) {
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

        <div className="space-y-4 flex-1 overflow-y-auto min-h-0 mb-6">
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

        {requirements.length > 0 && (
          <button 
            onClick={onSendToApprovals}
            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-600 transition-colors shrink-0 mb-4 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Enviar a Aprobaciones
          </button>
        )}
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
