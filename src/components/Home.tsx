import { Link } from 'react-router-dom';
import { MapPin, FileText, PhoneCall, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const features = [
    {
      title: "Find Nearby Help",
      desc: "Locate hospitals, police stations, and pharmacies within 5km of your current position.",
      icon: <MapPin className="text-blue-500" size={32} />,
      link: "/map",
      color: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-200"
    },
    {
      title: "Scan Documents",
      desc: "Extract text from emergency documents or prescriptions using local OCR technology.",
      icon: <FileText className="text-emerald-500" size={32} />,
      link: "/ocr",
      color: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-200"
    },
    {
      title: "Emergency Contacts",
      desc: "Manage your trusted contacts for quick access during critical situations.",
      icon: <PhoneCall className="text-red-500" size={32} />,
      link: "/contacts",
      color: "from-red-500/10 to-rose-500/10",
      border: "border-red-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-widest"
        >
          <ShieldCheck size={16} />
          Urban Safety Companion
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight"
        >
          UrbanAssist <span className="text-blue-600">Lite</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed"
        >
          Your all-in-one emergency assistance tool. Find help, scan documents, and manage contacts—all without any paid APIs or tracking.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link 
            to="/map" 
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-200 flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <div className="flex items-center gap-6 px-6 py-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Zap size={16} className="text-amber-500" /> Fast & Local
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Globe size={16} className="text-blue-400" /> Open Data
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Link 
              to={f.link}
              className={`group block glass-card p-8 h-full border-2 ${f.border} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all">
                Explore Feature <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="glass-card p-12 bg-linear-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Privacy First. Always.</h2>
          <p className="text-slate-300 mb-8">
            UrbanAssist Lite runs entirely on open-source APIs and local browser technology. 
            We never store your location or documents on any server. Your data stays in your browser's LocalStorage.
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">No Tracking</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">No Ads</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">Open Source</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-48 -mb-48"></div>
      </section>
    </div>
  );
}
