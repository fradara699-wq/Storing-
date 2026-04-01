
import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { 
  BookOpen, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Droplets, 
  ClipboardList, 
  ChevronRight, 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Menu, 
  Zap, 
  MoveRight, 
  Info, 
  HeartPulse, 
  AlertCircle,
  Play,
  Monitor,
  ZapOff,
  Clock,
  Navigation,
  ExternalLink,
  Library,
  FileText,
  Copy,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import SectionWrapper from './components/SectionWrapper';
import { SectionId, NavItem, Message } from './types';
import { askHemoAssistant } from './services/geminiService';

const NAV_ITEMS: NavItem[] = [
  { id: SectionId.INTRO, label: 'Introducción', icon: 'BookOpen' },
  { id: SectionId.PRINCIPIOS, label: 'Principios', icon: 'Activity' },
  { id: SectionId.MODALIDADES, label: 'Modalidades', icon: 'Layers' },
  { id: SectionId.PURIFI, label: 'Purifi', icon: 'ShieldCheck' },
  { id: SectionId.PRIMING, label: 'Bibliografía', icon: 'Library' },
  { id: SectionId.INDICACIONES, label: 'Indicaciones', icon: 'ClipboardList' },
  { id: SectionId.PRESCRIPCION, label: 'Prescripción', icon: 'FileText' },
];

const MassTransportSVG = () => (
  <svg viewBox="0 0 500 280" className="w-full h-auto drop-shadow-xl bg-white rounded-xl border border-slate-100 p-2">
    <defs>
      <linearGradient id="fluidFlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#eff6ff" />
        <stop offset="50%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#eff6ff" />
      </linearGradient>
      <pattern id="grainPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="140" height="280" fill="url(#fluidFlow)" />
    <path d="M10,40 H130 M10,140 H130 M10,240 H130" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.4" />
    <text x="70" y="30" fontSize="11" textAnchor="middle" fill="#1e40af" fontWeight="bold">Sustancia (Bulk Solution)</text>
    <rect x="140" y="0" width="40" height="280" fill="#f8fafc" opacity="0.8" />
    <rect x="140" y="0" width="40" height="280" fill="none" stroke="#94a3b8" strokeDasharray="4 2" />
    <text x="160" y="260" fontSize="9" textAnchor="middle" fill="#64748b" transform="rotate(-90 160 260)">Capa Límite (Film)</text>
    <path d="M180,0 H500 V280 H180 Q210,140 180,0" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
    <path d="M180,0 H500 V280 H180 Q210,140 180,0" fill="url(#grainPattern)" opacity="0.3" />
    <text x="340" y="30" fontSize="11" textAnchor="middle" fill="#475569" fontWeight="bold">Matriz del Sorbente</text>
    <path d="M190,100 C280,100 320,130 380,130 C440,130 460,150 480,180 V220 C460,190 440,170 380,170 C320,170 280,200 192,200" fill="white" stroke="#334155" strokeWidth="1.5" />
    <circle cx="155" cy="140" r="12" fill="white" stroke="#ef4444" strokeWidth="2" />
    <text x="155" y="144" fontSize="10" textAnchor="middle" fill="#ef4444" fontWeight="bold">A</text>
    <circle cx="280" cy="145" r="12" fill="white" stroke="#ef4444" strokeWidth="2" />
    <text x="280" y="149" fontSize="10" textAnchor="middle" fill="#ef4444" fontWeight="bold">B</text>
    <circle cx="430" cy="145" r="12" fill="white" stroke="#10b981" strokeWidth="2" />
    <text x="430" y="149" fontSize="10" textAnchor="middle" fill="#10b981" fontWeight="bold">C</text>
    <path id="moleculePath" d="M30,140 H140 L190,150 C280,150 320,150 380,150 L460,150" fill="none" stroke="none" />
    <circle r="6" fill="#ef4444">
      <animateMotion dur="6s" repeatCount="indefinite">
        <mpath href="#moleculePath" />
      </animateMotion>
      <animate attributeName="r" values="6;7;6" dur="1s" repeatCount="indefinite" />
    </circle>
    <g fontSize="9" fill="#1e293b">
       <text x="185" y="90" fontWeight="bold">Estructura Porosa</text>
       <text x="410" y="120" fill="#059669" fontWeight="bold">Sitio de Adsorción</text>
    </g>
    <g transform="translate(10, 240)" fontSize="8">
       <rect width="8" height="8" fill="#ef4444" rx="2" />
       <text x="12" y="7" fill="#64748b">Molécula en tránsito</text>
    </g>
  </svg>
);

const BindingForcesSVG = () => (
  <svg viewBox="0 0 400 120" className="w-full h-auto">
    <g transform="translate(20, 20)">
      <circle cx="20" cy="30" r="15" fill="#e2e8f0" stroke="#94a3b8" />
      <circle cx="60" cy="30" r="15" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M35,30 Q40,20 45,30" fill="none" stroke="#64748b" strokeDasharray="2 2" />
      <text x="40" y="70" fontSize="10" textAnchor="middle" fontWeight="bold">van der Waals</text>
      <text x="40" y="85" fontSize="8" textAnchor="middle" fill="#64748b">(Fuerzas Débiles)</text>
    </g>
    <g transform="translate(150, 20)">
      <circle cx="20" cy="30" r="15" fill="#fee2e2" stroke="#ef4444" />
      <text x="20" y="34" fontSize="14" textAnchor="middle" fill="#ef4444" fontWeight="bold">+</text>
      <circle cx="60" cy="30" r="15" fill="#dbeafe" stroke="#3b82f6" />
      <text x="60" y="34" fontSize="14" textAnchor="middle" fill="#3b82f6" fontWeight="bold">-</text>
      <path d="M35,30 L45,30" stroke="#475569" strokeWidth="2" />
      <text x="40" y="70" fontSize="10" textAnchor="middle" fontWeight="bold">Enlace Iónico</text>
      <text x="40" y="85" fontSize="8" textAnchor="middle" fill="#64748b">(Electrostático)</text>
    </g>
    <g transform="translate(280, 20)">
      <rect x="5" y="15" width="70" height="30" rx="4" fill="#f1f5f9" stroke="#475569" />
      <circle cx="40" cy="30" r="10" fill="#1e293b" />
      <text x="40" y="70" fontSize="10" textAnchor="middle" fontWeight="bold">Interacción Hidrofóbica</text>
      <text x="40" y="85" fontSize="8" textAnchor="middle" fill="#64748b">(Alta Afinidad)</text>
    </g>
  </svg>
);

const CircuitSVG: React.FC<{ type: 'ECMO-HA' }> = ({ type }) => {
  const colors = {
    blood: '#ef4444', 
    return: '#3b82f6', 
    pump: '#64748b',
    device: '#94a3b8',
    sorbent: '#64748b',
    oxygenator: '#3b82f6'
  };

  return (
    <svg viewBox="0 0 320 140" className="w-full h-auto drop-shadow-sm">
      <defs>
        <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={colors.return} />
        </marker>
      </defs>
      <path d="M20,70 L60,70" stroke={colors.blood} strokeWidth="2" fill="none" />
      <circle cx="75" cy="70" r="12" fill="white" stroke={colors.pump} strokeWidth="2" />
      
      {type === 'ECMO-HA' && (
        <>
          <path d="M90,70 L110,70" stroke={colors.blood} strokeWidth="2" fill="none" />
          <rect x="210" y="45" width="70" height="50" rx="6" fill="#eff6ff" stroke={colors.oxygenator} strokeWidth="2" />
          <text x="245" y="40" fontSize="7" textAnchor="middle" fill="#1e40af" fontWeight="bold">Oxigenador</text>
          <path d="M110,70 V110 H130" stroke={colors.blood} strokeWidth="1.5" fill="none" />
          <rect x="130" y="95" width="45" height="25" rx="3" fill="#cbd5e1" stroke={colors.sorbent} strokeWidth="1.2" />
          <text x="152" y="110" fontSize="7" textAnchor="middle" fill="#475569" fontWeight="bold">Sorbente</text>
          <path d="M175,110 H195 V70" stroke={colors.return} strokeWidth="1.5" fill="none" />
          <path d="M110,70 H210" stroke={colors.blood} strokeWidth="2" fill="none" />
          <path d="M280,70 H310" stroke={colors.return} strokeWidth="2" fill="none" markerEnd="url(#arrowBlue)" />
        </>
      )}
    </svg>
  );
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    nombre: '',
    antecedentes: '',
    procalcitonina: '',
    sofa: '',
    il6: '',
    // SOFA components
    sofaResp: 0,
    sofaCoag: 0,
    sofaHep: 0,
    sofaCardio: 0,
    sofaCNS: 0,
    sofaRenal: 0
  });
  const [showSofaCalc, setShowSofaCalc] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const totalSofa = 
      Number(prescriptionForm.sofaResp) + 
      Number(prescriptionForm.sofaCoag) + 
      Number(prescriptionForm.sofaHep) + 
      Number(prescriptionForm.sofaCardio) + 
      Number(prescriptionForm.sofaCNS) + 
      Number(prescriptionForm.sofaRenal);
    
    if (showSofaCalc) {
      setPrescriptionForm(prev => ({ ...prev, sofa: totalSofa.toString() }));
    }
  }, [
    prescriptionForm.sofaResp, 
    prescriptionForm.sofaCoag, 
    prescriptionForm.sofaHep, 
    prescriptionForm.sofaCardio, 
    prescriptionForm.sofaCNS, 
    prescriptionForm.sofaRenal,
    showSofaCalc
  ]);

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrescriptionForm(prev => ({ ...prev, [name]: value }));
  };

  const generatePrescription = () => {
    const { nombre, antecedentes } = prescriptionForm;
    if (!nombre || !antecedentes) {
      alert("Por favor complete al menos el nombre y los antecedentes.");
      return;
    }
    setGeneratedMarkdown("GENERATED"); // Use as a flag
  };

  const copyToClipboard = () => {
    const report = document.getElementById('medical-report-content');
    if (!report) return;

    const range = document.createRange();
    const selection = window.getSelection();
    
    range.selectNodeContents(report);
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      const success = document.execCommand('copy');
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error("Error al copiar", err);
    }
    
    selection?.removeAllRanges();
  };

  const generatePDF = () => {
    const element = document.getElementById('medical-report-content');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5] as [number, number],
      filename: 'Prescripcion_UCC_HospitalPrivado.pdf',
      image: { type: 'jpeg' as const, quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleNavAction = (id: SectionId) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const userMsg: Message = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);
    const response = await askHemoAssistant(userInput);
    setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  return (
    <div className="flex flex-col min-h-screen text-slate-800 relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.06] overflow-hidden select-none">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-24 rotate-[-25deg] scale-150">
          {[...Array(12)].map((_, i) => (
            <img 
              key={i}
              src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Storing%20.png" 
              alt="" 
              className="w-64 h-64 object-contain"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img 
              src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Storing%20.png" 
              alt="Logo" 
              className="w-32 h-32 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HemoPortal</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => handleNavAction(item.id)} className={`text-sm font-medium transition-colors ${activeSection === item.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>{item.label}</button>
            ))}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2"><Menu className="w-6 h-6 text-slate-600" /></button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col pt-20 px-6">
           <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2"><X className="w-8 h-8 text-slate-600" /></button>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => handleNavAction(item.id)} className="py-4 text-left border-b border-slate-100 text-lg font-medium flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600">
                   {item.id === SectionId.INTRO && <BookOpen className="w-5 h-5" />}
                   {item.id === SectionId.PRINCIPIOS && <Activity className="w-5 h-5" />}
                   {item.id === SectionId.MODALIDADES && <Layers className="w-5 h-5" />}
                   {item.id === SectionId.PURIFI && <ShieldCheck className="w-5 h-5" />}
                   {item.id === SectionId.PRIMING && <Library className="w-5 h-5" />}
                   {item.id === SectionId.INDICACIONES && <ClipboardList className="w-5 h-5" />}
                   {item.id === SectionId.PRESCRIPCION && <FileText className="w-5 h-5" />}
                </div>
                {item.label}
              </button>
            ))}
        </div>
      )}

      <div className="bg-pink-100 text-slate-900 py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <img 
            src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Storing%20.png" 
            alt="Storing Logo Giant" 
            className="mx-auto mb-12 w-[500px] h-auto object-contain drop-shadow-2xl animate-in zoom-in duration-700"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Gestión Avanzada de la <span className="text-pink-600">Tormenta de Citoquinas</span></h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Portal interactivo modular para profesionales de la salud. Explore cada sección para profundizar en la terapia de hemoadsorción.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => handleNavAction(SectionId.INTRO)} className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-pink-900/20">Comenzar Módulos</button>
            <button onClick={() => setIsChatOpen(true)} className="px-8 py-3 bg-white/40 hover:bg-white/60 rounded-full font-semibold transition-all border border-pink-200">Consultar Asistente IA</button>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-24 pt-8 bg-pink-50">
        <div className="max-w-4xl mx-auto px-4 mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest mb-4">Currículo de Formación</span>
          <p className="text-slate-500 text-sm">Haga clic en cada encabezado para expandir el contenido y construir su conocimiento paso a paso.</p>
        </div>

        <SectionWrapper id={SectionId.INTRO} title="Introducción y Racionalidad" forceOpen={activeSection === SectionId.INTRO}>
          <div className="space-y-6 text-slate-700">
            <div className="border-l-4 border-blue-600 pl-6 mb-8">
              <p className="text-lg font-medium leading-relaxed italic">La hemoadsorción ha evolucionado notablemente desde su aplicación inicial hace casi dos décadas. El desarrollo de membranas adsortivas eficaces y con mayor biocompatibilidad ha permitido su aplicación en el tratamiento de una gran variedad de condiciones clínicas.</p>
            </div>
            <p>Actualmente, los avances en toxicología, farmacología, biología e inmunología proporcionan una base sólida para el uso de la hemoadsorción en pacientes con intoxicaciones por fármacos, sepsis, estados inflamatorios, trastornos metabólicos o intoxicaciones endógenas.</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Definición y Objetivos</h4>
              <p className="mb-4">La hemoadsorción es un tratamiento de <strong>purificación extracorpórea de sangre y plasma</strong> cuyo objetivo es aumentar la eliminación de solutos, células o patógenos que, debido a sus características físico-químicas, no son susceptibles de aclaramiento mediante técnicas convencionales.</p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.PRINCIPIOS} title="Principios Fisicoquímicos" forceOpen={activeSection === SectionId.PRINCIPIOS}>
          <div className="space-y-12">
            <p className="text-slate-700">Los mecanismos físico-químicos que regulan la adsorción de superficie son múltiples y dependen de cómo la molécula interactúa con la matriz del sorbente.</p>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3"><MoveRight className="w-6 h-6 text-blue-600" /> Mecanismos de Transporte de Masa</h4>
              <div className="grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7"><MassTransportSVG /></div>
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-4 bg-white rounded-2xl border-l-4 border-red-500 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">A</span><h5 className="font-bold text-slate-900 text-sm">Transferencia Externa (Interfase)</h5></div>
                    <p className="text-xs text-slate-600 leading-relaxed">El soluto se desplaza por <span className="text-blue-600 font-medium">convección</span> desde el fluido principal, atravesando por <span className="text-blue-600 font-medium">difusión</span> una capa límite hidrodinámica hacia la superficie del sorbente.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-l-4 border-red-500 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">B</span><h5 className="font-bold text-slate-900 text-sm">Transferencia Interna (Intrafase)</h5></div>
                    <p className="text-xs text-slate-600 leading-relaxed">Movimiento dentro de la estructura porosa mediante <span className="text-blue-600 font-medium">convección de poros</span> y difusión intraparda hacia los sitios activos internos.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-l-4 border-green-500 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">C</span><h5 className="font-bold text-slate-900 text-sm">Adsorción de Superficie</h5></div>
                    <p className="text-xs text-slate-600 leading-relaxed">Etapa final donde el soluto se desplaza por <span className="text-green-600 font-medium">difusión de superficie</span> y queda finalmente atrapado en la matriz mediante enlaces físico-químicos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Fuerzas de Unión Molecular</h4>
              <div className="mb-8"><BindingForcesSVG /></div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm"><h5 className="font-bold text-slate-900 mb-2">Fuerzas de van der Waals</h5><p className="text-xs text-slate-600 leading-relaxed">Generadas por la interacción entre electrones de una molécula y el núcleo de otra. Son fuerzas débiles y generalmente reversibles.</p></div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm"><h5 className="font-bold text-slate-900 mb-2">Enlaces Iónicos</h5><p className="text-xs text-slate-600 leading-relaxed">Atracción electrostática entre iones con cargas opuestas. Es el principio típico de las resinas de intercambio iónico.</p></div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm"><h5 className="font-bold text-slate-900 mb-2">Enlaces Hidrofóbicos</h5><p className="text-xs text-slate-600 leading-relaxed">Fuerzas de unión fuertes generadas por la afinidad hidrofóbica mutua entre el sorbente y las moléculas del soluto.</p></div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.MODALIDADES} title="Modalidades y Técnicas" forceOpen={activeSection === SectionId.MODALIDADES}>
          <div className="space-y-8 text-slate-700">
            <p className="mb-2">La hemoadsorción es una técnica versátil que puede implementarse de forma independiente o integrada en otros sistemas extracorpóreos:</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-6 text-center uppercase tracking-wider text-xs opacity-60">Esquemas de Configuración Extracorpórea</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                  <h5 className="font-bold text-xs text-blue-600 mb-3">Hemoadsorción (HA) aislada</h5>
                  <div className="flex-1 flex items-center justify-center">
                    <img 
                      src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Hemoadsorcion%20.png" 
                      alt="Circuito Hemoadsorción" 
                      className="w-full h-auto max-h-[140px] object-contain rounded-lg"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                  <h5 className="font-bold text-xs text-blue-600 mb-3">Hemoadsorción + HD/CRRT</h5>
                  <div className="flex-1 flex items-center justify-center">
                    <img 
                      src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/hemoadsorcion%20%2C%20filtro%20.png" 
                      alt="Circuito Hemoadsorción + HD/CRRT" 
                      className="w-full h-auto max-h-[140px] object-contain rounded-lg"
                    />
                  </div>
                  <a href="https://www.youtube.com/watch?v=CyS-tIhCYPc" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"><Play className="w-3 h-3 fill-current" /> Ver Vídeo Demostrativo</a>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                  <h5 className="font-bold text-xs text-blue-600 mb-3">Integración en ECMO</h5>
                  <div className="flex-1"><CircuitSVG type="ECMO-HA" /></div>
                  <a href="https://www.youtube.com/watch?v=ugxPMdX58m8" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"><Play className="w-3 h-3 fill-current" /> Ver Vídeo Demostrativo</a>
                </div>
              </div>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start"><ChevronRight className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" /><div><h5 className="font-bold">Hemoperfusión Directa</h5><p className="text-sm">Uso del cartucho como único dispositivo en el circuito extracorpóreo.</p></div></li>
              <li className="flex gap-3 items-start"><ChevronRight className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" /><div><h5 className="font-bold">Integración en CRRT</h5><p className="text-sm">El cartucho se coloca en serie con el hemofiltro o en un bypass lateral.</p></div></li>
              <li className="flex gap-3 items-start"><ChevronRight className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" /><div><h5 className="font-bold">Integración en ECMO / CPB</h5><p className="text-sm">Uso en el bypass lateral en circuitos de oxigenación por membrana, generalmente conectado después de la bomba centrífuga.</p></div></li>
            </ul>
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.PURIFI} title="PuriFi™: El Sistema Independiente para Hemoadsorción" forceOpen={activeSection === SectionId.PURIFI}>
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center shadow-inner group overflow-hidden">
                   <div className="group-hover:scale-105 transition-transform duration-500 mb-6 w-full flex justify-center">
                      <img src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/images/images/Purifi%20.png" alt="Dispositivo PuriFi" className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl" />
                   </div>
                    <a href="https://purifi-tutorial.cytosorbents.com/index.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"><ExternalLink className="w-4 h-4" /> Acceder al Tutorial PuriFi</a>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center"><p className="text-xs text-blue-800 font-semibold uppercase tracking-widest">Tecnología de Sorbente compatible</p><p className="text-lg font-bold text-blue-900">CytoSorb®</p></div>
              </div>
              <div className="flex-1 space-y-6">
                <p className="text-lg leading-relaxed text-slate-700">El dispositivo <strong className="text-blue-600">PuriFi™</strong> (desarrollado por CytoSorbents) es una consola de bombeo y monitoreo extracorpóreo diseñada para administrar la terapia de adsorción de forma <strong>autónoma</strong>.</p>
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl border-l-4 border-blue-500 italic shadow-xl">"Si CytoSorb es el 'filtro', PuriFi es la 'consola' que lo hace funcionar de forma independiente sin depender de máquinas de diálisis o CRRT."</div>
                <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Zap className="w-6 h-6 text-amber-500" /> ¿Por qué es innovador?</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors"><ZapOff className="w-8 h-8 text-blue-600 mb-3" /><h5 className="font-bold text-slate-900 mb-1">Independencia</h5><p className="text-xs text-slate-500">Trata pacientes sin falla renal pero con tormenta de citoquinas sin ocupar diálisis.</p></div>
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors"><Navigation className="w-8 h-8 text-blue-600 mb-3" /><h5 className="font-bold text-slate-900 mb-1">Movilidad</h5><p className="text-xs text-slate-500">Compacto y móvil, ideal para traslados rápidos entre Emergencias, UCI o Quirófano.</p></div>
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors"><Clock className="w-8 h-8 text-blue-600 mb-3" /><h5 className="font-bold text-slate-900 mb-1">Simplicidad</h5><p className="text-xs text-slate-500">Configuración en aprox. 10 minutos, vital en situaciones críticas de respuesta rápida.</p></div>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight"><Monitor className="w-5 h-5 text-blue-600" /> Características Técnicas</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"><ChevronRight className="w-4 h-4 text-blue-600" /></div><div><span className="font-bold block text-sm">Interfaz Intuitiva</span><p className="text-xs text-slate-600">Pantalla táctil que guía al personal médico paso a paso en el montaje.</p></div></li>
                  <li className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"><ChevronRight className="w-4 h-4 text-blue-600" /></div><div><span className="font-bold block text-sm">Sensores de Seguridad</span><p className="text-xs text-slate-600">Monitoreo constante de presiones y detector de burbujas ultrasónico con auto-nivelado.</p></div></li>
                  <li className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"><ChevronRight className="w-4 h-4 text-blue-600" /></div><div><span className="font-bold block text-sm">Versatilidad de Flujo</span><p className="text-xs text-slate-600">Ajustable según las necesidades del paciente (adultos y pediatría).</p></div></li>
                  <li className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"><ChevronRight className="w-4 h-4 text-blue-600" /></div><div><span className="font-bold block text-sm">Gestión Térmica</span><p className="text-xs text-slate-600">Opción para controlar la temperatura de la sangre durante el circuito extracorpóreo.</p></div></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                 <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight"><Activity className="w-5 h-5 text-blue-600" /> Comparativa vs Estándar</h4>
                 <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                       <tr><th className="px-4 py-3">Característica</th><th className="px-4 py-3 text-blue-600">PuriFi System</th><th className="px-4 py-3">HD Convencional</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       <tr><td className="px-4 py-3 font-medium text-slate-600">Objetivo Primario</td><td className="px-4 py-3 text-blue-900 font-bold">Purificación sanguínea</td><td className="px-4 py-3">Función renal</td></tr>
                       <tr><td className="px-4 py-3 font-medium text-slate-600">Uso de Líquidos</td><td className="px-4 py-3 text-blue-900 font-bold">No requiere bolsas</td><td className="px-4 py-3">Grandes volúmenes</td></tr>
                       <tr><td className="px-4 py-3 font-medium text-slate-600">Complejidad</td><td className="px-4 py-3 text-blue-900 font-bold">Baja (Plug-and-play)</td><td className="px-4 py-3">Alta (Especializado)</td></tr>
                       <tr><td className="px-4 py-3 font-medium text-slate-600">Portabilidad</td><td className="px-4 py-3 text-blue-900 font-bold">Alta (Liviano)</td><td className="px-4 py-3">Baja (Equipos robustos)</td></tr>
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.PRIMING} title="Bibliografía Científica" forceOpen={activeSection === SectionId.PRIMING}>
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-full flex items-start gap-4 p-6 bg-slate-50 border border-slate-200 rounded-3xl mb-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl"><Library className="w-8 h-8" /></div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Base de Datos de Literatura</h4>
                <p className="text-slate-600 mb-6">Acceda a la base de datos oficial de CytoSorbents para consultar publicaciones científicas, estudios clínicos, revisiones y reportes de casos sobre hemoadsorción.</p>
                <a href="https://cytosorbents.com/lit-db" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/20"><ExternalLink className="w-4 h-4" /> Explorar Literatura Científica</a>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.INDICACIONES} title="Indicaciones Clínicas" forceOpen={activeSection === SectionId.INDICACIONES}>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Sepsis / SIRS', desc: 'Control de la respuesta inflamatoria masiva.', icon: AlertCircle },
              { title: 'Cirugía Cardíaca', desc: 'Manejo perioperatorio de mediadores inflamatorios.', icon: HeartPulse },
              { title: 'Falla Hepática', desc: 'Eliminación de toxinas urémicas y bilirrubina.', icon: Droplets },
              { title: 'Rabdomiólisis', desc: 'Aclaramiento rápido de mioglobina.', icon: Zap },
              { title: 'Pancreatitis', desc: 'Manejo de estados hiperinflamatorios tempranos.', icon: Info },
              { title: 'COVID-19', desc: 'Soporte en pacientes críticos con tormenta de citoquinas.', icon: ShieldCheck },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (<div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm"><h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Icon className="w-4 h-4 text-blue-500" /> {item.title}</h5><p className="text-xs text-slate-500">{item.desc}</p></div>);
            })}
          </div>
        </SectionWrapper>

        <SectionWrapper id={SectionId.PRESCRIPCION} title="Generador de Prescripción Médica" forceOpen={activeSection === SectionId.PRESCRIPCION}>
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Datos de la Prescripción</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre y Apellido</label>
                    <input name="nombre" value={prescriptionForm.nombre} onChange={handlePrescriptionChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Antecedentes</label>
                    <textarea name="antecedentes" value={prescriptionForm.antecedentes} onChange={handlePrescriptionChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm h-20" placeholder="Ej: HTA, DM2, IRC..." />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Procalcitonina</label>
                      <input name="procalcitonina" type="number" step="0.01" value={prescriptionForm.procalcitonina} onChange={handlePrescriptionChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="ng/mL" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SOFA Score</label>
                      <div className="relative">
                        <input name="sofa" type="number" value={prescriptionForm.sofa} onChange={handlePrescriptionChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="0-24" />
                        <button 
                          onClick={() => setShowSofaCalc(!showSofaCalc)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                          title="Calcular SOFA"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">IL-6 (pg/mL)</label>
                      <input name="il6" type="number" value={prescriptionForm.il6} onChange={handlePrescriptionChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Ej: 650" />
                    </div>
                  </div>

                  {showSofaCalc && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-bold text-blue-800 uppercase">Calculadora SOFA</h5>
                        <button onClick={() => setShowSofaCalc(false)} className="text-blue-400 hover:text-blue-600"><X className="w-3 h-3" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Respiratorio (PaO2/FiO2)</label>
                          <select name="sofaResp" value={prescriptionForm.sofaResp} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">≥ 400 (0)</option>
                            <option value="1">&lt; 400 (1)</option>
                            <option value="2">&lt; 300 (2)</option>
                            <option value="3">&lt; 200 + VM (3)</option>
                            <option value="4">&lt; 100 + VM (4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Coagulación (Plaquetas)</label>
                          <select name="sofaCoag" value={prescriptionForm.sofaCoag} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">≥ 150 (0)</option>
                            <option value="1">&lt; 150 (1)</option>
                            <option value="2">&lt; 100 (2)</option>
                            <option value="3">&lt; 50 (3)</option>
                            <option value="4">&lt; 20 (4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Hígado (Bilirrubina)</label>
                          <select name="sofaHep" value={prescriptionForm.sofaHep} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">&lt; 1.2 (0)</option>
                            <option value="1">1.2 - 1.9 (1)</option>
                            <option value="2">2.0 - 5.9 (2)</option>
                            <option value="3">6.0 - 11.9 (3)</option>
                            <option value="4">&gt; 12.0 (4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Cardio (PAM/Vasopresores)</label>
                          <select name="sofaCardio" value={prescriptionForm.sofaCardio} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">PAM ≥ 70 (0)</option>
                            <option value="1">PAM &lt; 70 (1)</option>
                            <option value="2">Dopa ≤ 5 o Dobuta (2)</option>
                            <option value="3">Dopa &gt; 5 o Norad ≤ 0.1 (3)</option>
                            <option value="4">Dopa &gt; 15 o Norad &gt; 0.1 (4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">SNC (Glasgow)</label>
                          <select name="sofaCNS" value={prescriptionForm.sofaCNS} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">15 (0)</option>
                            <option value="1">13 - 14 (1)</option>
                            <option value="2">10 - 12 (2)</option>
                            <option value="3">6 - 9 (3)</option>
                            <option value="4">&lt; 6 (4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Renal (Creatinina/Uresis)</label>
                          <select name="sofaRenal" value={prescriptionForm.sofaRenal} onChange={handlePrescriptionChange} className="w-full p-1.5 bg-white border border-blue-200 rounded text-xs">
                            <option value="0">&lt; 1.2 (0)</option>
                            <option value="1">1.2 - 1.9 (1)</option>
                            <option value="2">2.0 - 3.4 (2)</option>
                            <option value="3">3.5 - 4.9 o &lt; 500ml/d (3)</option>
                            <option value="4">&gt; 5.0 o &lt; 200ml/d (4)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={generatePrescription} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Generar Documento</button>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-600" /> Vista Previa</h4>
                  {generatedMarkdown && (
                    <div className="flex gap-3">
                      <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        {copySuccess ? <><CheckCircle2 className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar Texto</>}
                      </button>
                      <button onClick={generatePDF} className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                        <FileDown className="w-4 h-4" /> Generar PDF
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl p-4 md:p-8 overflow-y-auto max-h-[800px] shadow-inner" ref={previewRef}>
                  {generatedMarkdown ? (
                    <div id="medical-report-content" className="report-page bg-white text-black p-12 font-sans shadow-lg mx-auto w-full max-w-[816px] min-h-[1056px] leading-relaxed box-border relative overflow-hidden">
                      {/* Report Watermark */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] select-none">
                        <img 
                          src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Storing%20.png" 
                          alt="" 
                          className="w-[500px] h-[500px] object-contain rotate-[-30deg]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <header className="section text-center border-b-4 report-header-title pb-4 mb-8 relative z-10" style={{ borderColor: '#004a99' }}>
                        <h2 className="m-0 report-header-title text-2xl font-bold uppercase tracking-tight">Hospital Privado Universitario de Córdoba</h2>
                        <p className="m-1 text-lg font-semibold report-text-muted">Unidad de Cuidados Críticos</p>
                        <p className="m-0 text-sm"><strong>Fecha:</strong> 24 de febrero de 2026</p>
                      </header>

                      <div className="section text-center mb-8 relative z-10">
                        <h3 className="underline text-lg font-bold uppercase m-0">PRESCRIPCIÓN DE TRATAMIENTO DE HEMOADSORCIÓN</h3>
                      </div>

                      <div className="section mb-6 relative z-10">
                        <table className="w-full border-collapse border report-border table-auto">
                          <tbody>
                            <tr>
                              <th className="border report-border p-3 text-left report-table-header text-xs uppercase font-bold w-1/4">PACIENTE</th>
                              <td className="border report-border p-3 text-sm break-words w-1/4">{prescriptionForm.nombre || '---'}</td>
                              <th className="border report-border p-3 text-left report-table-header text-xs uppercase font-bold w-1/4">ANTECEDENTES</th>
                              <td className="border report-border p-3 text-sm break-words w-1/4">{prescriptionForm.antecedentes || '---'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="section mb-6 relative z-10">
                        <table className="w-full border-collapse border report-border table-auto">
                          <thead>
                            <tr>
                              <th className="border report-border p-3 text-left report-table-header text-xs uppercase font-bold w-[35%]">PARÁMETRO DE RIESGO</th>
                              <th className="border report-border p-3 text-left report-table-header text-xs uppercase font-bold w-[15%]">VALOR</th>
                              <th className="border report-border p-3 text-left report-table-header text-xs uppercase font-bold w-[50%]">INTERPRETACIÓN CLÍNICA (TIGRIS)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border report-border p-3 text-sm font-bold">Procalcitonina</td>
                              <td className="border report-border p-3 text-sm break-words">{prescriptionForm.procalcitonina || '---'} ng/mL</td>
                              <td className="border report-border p-3 text-sm break-words">
                                {parseFloat(prescriptionForm.procalcitonina) > 0.5 ? 'Sepsis Grave / Shock Séptico probable' : 'Marcador de infección bacteriana.'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border report-border p-3 text-sm font-bold">SOFA Score</td>
                              <td className="border report-border p-3 text-sm break-words">{prescriptionForm.sofa || '---'}</td>
                              <td className="border report-border p-3 text-sm break-words">
                                {parseFloat(prescriptionForm.sofa) > 12 ? 'Falla Multiorgánica Avanzada (Mortalidad >50%)' : 'Puntaje de disfunción orgánica.'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border report-border p-3 text-sm font-bold">IL-6 (Interleucina-6)</td>
                              <td className="border report-border p-3 text-sm break-words">{prescriptionForm.il6 || '---'} pg/mL</td>
                              <td className="border report-border p-3 text-sm break-words">
                                {parseFloat(prescriptionForm.il6) > 500 ? 'Hiperinflamación Severa / Tormenta Citoquinas' : 'Nivel de citoquinas circulantes.'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="section mb-10 relative z-10">
                        <p className="font-bold mb-2">Justificación Clínica:</p>
                        <div className="text-justify text-sm leading-relaxed">
                          "Paciente cursa shock séptico refractario en contexto de proceso infeccioso en tratamiento, con disfunción orgánica múltiple severa. Presenta compromiso hemodinámico con requerimiento de vasopresores a dosis elevadas para sostener presión arterial media adecuada, hipoperfusión tisular con hiperlactatemia persistente y vasoplejía. Se asocia insuficiencia respiratoria que requiere ventilación mecánica, lesión renal aguda con alteraciones metabólicas y balance hídrico comprometido, y encefalopatía séptica en el contexto de enfermedad crítica y sedación. Se observan además alteraciones hematológicas y compromiso hepático compatibles con respuesta inflamatoria sistémica severa. El puntaje SOFA estimado es mayor de 12, reflejando falla multiorgánica avanzada y alto riesgo de mortalidad. A pesar del manejo estándar optimizado —incluyendo antibioticoterapia de amplio espectro, control del foco infeccioso, reanimación hemodinámica guiada por objetivos y soporte multiorgánico— el paciente presenta evolución desfavorable con progresión de la disfunción orgánica. Dado el contexto de shock séptico grave con disfunción multiorgánica progresiva, probable endotoxemia y respuesta inflamatoria desregulada, se indica iniciar hemoadsorción extracorpórea dirigida a endotoxina y mediadores inflamatorios, como terapia adyuvante, con el objetivo de modular la respuesta inflamatoria sistémica, mejorar la estabilidad hemodinámica y limitar la progresión del daño orgánico. La indicación se fundamenta en los criterios clínicos de shock séptico refractario con requerimientos elevados de vasopresores, disfunción orgánica severa y deterioro evolutivo pese al tratamiento estándar, y se realiza de acuerdo con el protocolo utilizado en el TIGRIS Trial, que evaluó hemoadsorción con polimixina B en pacientes con shock séptico endotóxico, demostrando reducción de mortalidad y beneficio clínico en pacientes seleccionados. Se planifica la terapia integrada al soporte extracorpóreo vigente, con monitoreo hemodinámico continuo, evaluación de respuesta clínica, control de balance hídrico y ajuste farmacológico considerando la posible eliminación extracorpórea de fármacos."
                        </div>
                      </div>

                      <div className="section firma-container mt-12 pt-4 break-inside-avoid relative z-10">
                        <p className="m-0">_________________________________</p>
                        <p className="m-0 font-bold text-sm">Dr. Avila Rafael</p>
                        <p className="m-0 text-sm">Jefe de UCC</p>
                        <p className="m-0 text-sm">Hospital Privado Universitario de Córdoba</p>
                      </div>

                      <div className="footer-biblio mt-12 pt-4 border-t border-slate-200 text-[11px] report-text-muted relative z-10">
                        <p className="font-bold mb-2">Referencias Científicas:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Iba T, Helms J, et al. TIGRIS and EUPHRATES eventually join and provide new evidence: a narrative review of the polymyxin B hemoperfusion. Journal of Intensive Care. 2025; 13:67. <a href="https://doi.org/10.1186/s40560-025-00835-6" className="report-link underline">https://doi.org/10.1186/s40560-025-00835-6</a></li>
                          <li>Bellomo R, et al. Hemoadsorption: consensus report of the 30th Acute Disease Quality Initiative workgroup. Nephrol Dial Transplant. 2024; 39:1945-1964. <a href="https://doi.org/10.1093/ndt/gfae089" className="report-link underline">https://doi.org/10.1093/ndt/gfae089</a></li>
                          <li>Greco M, et al. Hemoadsorption in Cardiac Surgery and Critical Care: A Systematic Review and Meta-Analysis. Healthcare. 2025; 13(20):2603. <a href="https://doi.org/10.3390/healthcare13202603" className="report-link underline">https://doi.org/10.3390/healthcare13202603</a></li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm">Complete los datos y haga clic en "Generar Documento" para ver la prescripción estructurada.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <footer className="bg-pink-100 text-slate-600 py-12 px-4 border-t border-pink-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/fradara699-wq/medical-media/main/Storing%20.png" 
              alt="Logo" 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-slate-900 font-bold text-lg">HemoPortal</span>
          </div>
          <p className="text-xs">© 2024 HemoPortal. Portal de formación para profesionales de la salud.</p>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-slate-900 hover:text-pink-600 transition-colors text-sm font-medium">Volver Arriba</button>
        </div>
      </footer>

      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"><MessageSquare className="w-8 h-8" /></button>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[450px] md:h-[600px] bg-white z-[100] flex flex-col shadow-2xl md:rounded-2xl border border-slate-200 animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white md:rounded-t-2xl">
            <div className="flex items-center gap-3"><Activity className="w-6 h-6" /><h4 className="font-bold text-sm">HemoAssistant IA</h4></div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatMessages.length === 0 && (<div className="text-center py-10"><p className="text-sm text-slate-500">¿En qué puedo ayudarte sobre la terapia de hemoadsorción?</p></div>)}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>{msg.content}</div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-slate-400 animate-pulse">Escribiendo...</div>}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white md:rounded-b-2xl flex gap-2">
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Pregunta algo..." className="flex-1 text-sm bg-slate-100 rounded-xl px-4 py-3 outline-none" />
            <button disabled={isTyping} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
