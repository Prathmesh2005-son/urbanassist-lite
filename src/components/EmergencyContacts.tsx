import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone, User, ShieldAlert } from 'lucide-react';
import { EmergencyContact } from '../lib/utils';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('emergency_contacts');
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveContacts = (newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
    localStorage.setItem('emergency_contacts', JSON.stringify(newContacts));
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name,
      phone,
      relation
    };
    
    saveContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setRelation('');
  };

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 rounded-xl text-red-600">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Emergency Contacts</h1>
          <p className="text-slate-500 text-sm">Keep your trusted contacts ready for quick access.</p>
        </div>
      </div>

      <form onSubmit={addContact} className="glass-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 890"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relation</label>
          <input
            type="text"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Family / Friend"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-200"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="glass-card p-4 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{contact.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={14} />
                  <span>{contact.phone}</span>
                  {contact.relation && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-tighter">
                      {contact.relation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteContact(contact.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            No contacts added yet.
          </div>
        )}
      </div>
    </div>
  );
}
