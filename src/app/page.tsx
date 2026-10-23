'use client';
import { useState } from 'react';
type Page = 'dashboard'|'loans'|'repayments'|'momo'|'settings'|'users'|'admin'|'ceo'|'defaulters'|'dormant'|'landing'|'apply';

function Logo({size=36, white=false}:{size?:number, white?:boolean}){
  return (
    <div className="flex items-center gap-2.5">
      <div style={{width:size, height:size}} className="shrink-0 rounded-full overflow-hidden bg-white flex items-center justify-center border border-zinc-100">
        <img src="/logo.png" alt="Akwaaba" className="w-[92%] h-[92%] object-contain" />
      </div>
      <div className="leading-[0.9]">
        <div className={`font-black tracking-tight ${white ? 'text-white' : 'text-[#0A2A8A]'}`} style={{fontSize:size*0.42}}>AKWAABA</div>
        <div className={`font-bold tracking-[0.18em] ${white ? 'text-zinc-400' : 'text-[#0A2A8A]'}`} style={{fontSize:size*0.24}}>CREDIT</div>
      </div>
    </div>
  )
}

export default function AkwaabaCredit() {
  const [view, setView] = useState<Page>('landing');
  const [tab, setTab] = useState<Page>('dashboard');
  const score = 742;
  const [ceoAuth, setCeoAuth] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [form, setForm] = useState<any>({idType:'Ghana Card', idNumber:''});
  const [submitted, setSubmitted] = useState(false);

  const goApp = (p:Page) => {
    if(p==='ceo' && !ceoAuth){ setTab('ceo'); setView('dashboard'); return; }
    if(p==='admin' && !adminAuth){ setTab('admin'); setView('dashboard'); return; }
    setTab(p); setView('dashboard');
  }
  const tryAuth = (target:Page) => {
    if(target==='ceo' && passInput==='CEO2026') setCeoAuth(true);
    if(target==='admin' && passInput==='ADMIN2026') setAdminAuth(true);
  }
  const isActive = (p:Page) => tab===p ? 'bg-white text-black rounded-full px-4 py-2 font-semibold' : 'px-4 py-2 text-zinc-400 hover:text-white';
  const handleForm = (k:string,v:any) => setForm((f:any)=>({...f,[k]:v}));

  if(view!=='landing'){
    return (
      <main className="min-h-screen bg-[#f5f5f2] text-zinc-900 flex">
        <aside className="w-[280px] min-h-screen bg-black text-white p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
          <Logo size={44} white />
          <div className="mt-8 space-y-1 text-[13px] flex-1">
            <button onClick={()=>setTab('dashboard')} className={`w-full text-left ${isActive('dashboard')}`}>Dashboard</button>
            <button onClick={()=>setTab('apply')} className={`w-full text-left ${isActive('apply')}`}>Apply for Loan 📝</button>
            <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>Loans</button>
            <button onClick={()=>setTab('repayments')} className={`w-full text-left ${isActive('repayments')}`}>Repayments</button>
            <button onClick={()=>setTab('momo')} className={`w-full text-left ${isActive('momo')}`}>MoMo History</button>
            <div className="text-[10px] tracking-widest text-zinc-500 mb-2 mt-6">MANAGEMENT</div>
            <button onClick={()=>setTab('users')} className={`w-full text-left ${isActive('users')}`}>Users • 12.4k</button>
            <button onClick={()=>setTab('defaulters')} className={`w-full text-left ${isActive('defaulters')}`}>Defaulters ⚠️ 342</button>
            <button onClick={()=>setTab('dormant')} className={`w-full text-left ${isActive('dormant')}`}>Dormant 💤 1.1k</button>
            <div className="text-[10px] tracking-widest text-zinc-500 mb-2 mt-6">ADMIN 🔐</div>
            <button onClick={()=>goApp('admin')} className={`w-full text-left ${isActive('admin')}`}>Admin • Staff {adminAuth?'🔓':'🔒'}</button>
            <button onClick={()=>goApp('ceo')} className={`w-full text-left ${isActive('ceo')}`}>CEO Dashboard {ceoAuth?'🔓':'🔒'} 👑</button>
            <button onClick={()=>setTab('settings')} className={`w-full text-left ${isActive('settings')}`}>Settings</button>
          </div>
          <button onClick={()=>setView('landing')} className="mt-6 text-xs underline text-zinc-400">← Back to site</button>
        </aside>

        <section className="flex-1 min-w-0">
          <header className="h-[70px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3"><Logo size={36}/><span className="text-xs text-zinc-400 capitalize">| {tab}</span></div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div>
          </header>
          <div className="p-6 max-w-5xl mx-auto">
            {tab==='dashboard' && (<><h1 className="text-3xl font-black">Akwaaba, Kwame! 👋</h1><div className="mt-6 grid md:grid-cols-4 gap-4"><div className="rounded-2xl bg-white border p-5"><div className="text-xs">Score</div><div className="text-3xl font-black">{score}</div></div><div className="rounded-2xl bg-white border p-5"><div className="text-xs">Available</div><div className="text-3xl font-black">₵2,500</div></div><div className="rounded-2xl bg-[#FCD116]/30 border p-5"><div className="text-xs">Next Payment</div><div className="text-3xl font-black">₵320</div></div><div className="rounded-2xl bg-black text-white p-5"><div className="text-xs text-zinc-400">Total Repaid</div><div className="text-3xl font-black">₵8,450</div></div></div><button onClick={()=>setTab('apply')} className="mt-6 h-12 px-6 rounded-full bg-[#0A2A8A] text-white font-semibold">+ Apply New Loan</button></>)}
            {tab==='apply' && (
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6 border-b pb-4"><div className="w-14 h-14 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div><h2 className="text-xl font-black text-[#0A2A8A]">AKWAABA CREDIT</h2><p className="text-xs text-zinc-500">Official Loan Application Form • Ghana</p></div></div>
                {!submitted ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold">Full Name *</label><input onChange={e=>handleForm('name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Kwame Asante Boateng"/></div>
                    <div><label className="text-xs font-semibold">Telephone Number *</label><input onChange={e=>handleForm('phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="0244 123 456"/></div>
                    <div><label className="text-xs font-semibold">Type of Card *</label><select value={form.idType} onChange={e=>handleForm('idType',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white"><option>Ghana Card</option><option>Voter's Card</option><option>Passport</option></select></div>
                    <div className="bg-[#FFF8DB] border-2 border-[#FCD116] rounded-xl p-3">
                      {form.idType==='Ghana Card' && (<><label className="text-xs font-bold text-[#0A2A8A]">Ghana Card Number * — GHA-</label><input onChange={e=>handleForm('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm font-mono" placeholder="GHA-123456789-0"/><div className="text-[10px] text-zinc-500 mt-1">Format: GHA-XXXXXXXXX-X</div></>)}
                      {form.idType==="Voter's Card" && (<><label className="text-xs font-bold">Voter ID Number *</label><input onChange={e=>handleForm('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="12345678"/></>)}
                      {form.idType==='Passport' && (<><label className="text-xs font-bold">Passport Number *</label><input onChange={e=>handleForm('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="G1234567"/></>)}
                    </div>
                    <div><label className="text-xs font-semibold">GPS Digital Address *</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="GA-123-4567"/></div>
                    <div><label className="text-xs font-semibold">Loan Purpose</label><select className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"><option>Business</option><option>School Fees</option><option>Emergency</option><option>Trading</option></select></div>
                    <div><label className="text-xs font-semibold">Amount</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="₵2,500"/></div>
                    <div><label className="text-xs font-semibold">Education</label><select className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"><option>SHS</option><option>Tertiary</option></select></div>
                    <div><label className="text-xs font-semibold">Profession</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Trader"/></div>
                    <div className="md:col-span-2 mt-2 border-t pt-4 font-bold text-sm">Guarantors (2 Required)</div>
                    <div><label className="text-xs">Guarantor 1 Name</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Ama Serwaa"/></div>
                    <div><label className="text-xs">Guarantor 1 Telephone *</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="024..."/></div>
                    <div><label className="text-xs">Guarantor 2 Name</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Kofi Mensah"/></div>
                    <div><label className="text-xs">Guarantor 2 Telephone *</label><input className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="055..."/></div>
                    <div className="md:col-span-2 mt-2 border-t pt-4 font-bold text-sm">Upload Documents</div>
                    <div><label className="text-xs">Ghana Card Front *</label><input type="file" className="mt-1 w-full text-sm"/></div>
                    <div><label className="text-xs">Ghana Card Back *</label><input type="file" className="mt-1 w-full text-sm"/></div>
                    <div><label className="text-xs">Selfie with Card *</label><input type="file" className="mt-1 w-full text-sm"/></div>
                    <div className="md:col-span-2 mt-6"><button onClick={()=>setSubmitted(true)} className="w-full h-12 rounded-full bg-[#0A2A8A] text-white font-bold">Submit Application → {form.idNumber || ''}</button></div>
                  </div>
                ) : (<div className="text-center py-10"><div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div className="mt-4 text-2xl font-black">Application Received!</div><div className="text-sm text-zinc-500">ID: {form.idType} • {form.idNumber}</div><button onClick={()=>setSubmitted(false)} className="mt-6 h-11 px-6 rounded-full border">Apply again</button></div>)}
              </div>
            )}
            {tab==='ceo' && !ceoAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div className="mt-3 font-black">CEO Encrypted 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="CEO2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('ceo')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock CEO</button></div>}
            {tab==='ceo' && ceoAuth && <div><h2 className="text-2xl font-bold">CEO Dashboard 👑 🔓</h2><div className="mt-4 grid md:grid-cols-3 gap-4"><div className="bg-black text-white rounded-xl p-5">Portfolio ₵4.2M</div><div className="bg-white border rounded-xl p-5">NPL 4.2%</div><div className="bg-[#0A2A8A] text-white rounded-xl p-5">Profit ₵312k</div></div></div>}
            {tab==='admin' && !adminAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div className="mt-3 font-black">Admin Encrypted 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="ADMIN2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('admin')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock Admin</button></div>}
            {tab==='admin' && adminAuth && <div><h2 className="text-2xl font-bold">Admin Staff 🔓</h2><div className="mt-4 bg-white border rounded-xl p-5">Staff management — 12 loan officers, 8 support</div></div>}
            {['loans','users','defaulters','dormant','repayments','momo','settings'].includes(tab) && <div className="bg-white border rounded-xl p-6 mt-4 flex gap-4 items-center"><div className="w-12 h-12 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div><div className="font-bold capitalize">{tab} Page</div><div className="text-sm text-zinc-500">Akwaaba Credit • Logo fixed • Content here</div></div></div>}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfbf7] text-zinc-900">
      <header className="h-[70px] bg-white border-b flex justify-between items-center px-6 sticky top-0 z-50"><Logo size={42}/><button onClick={()=>goApp('dashboard')} className="h-10 px-5 rounded-full bg-[#0A2A8A] text-white text-sm font-semibold">Open App</button></header>
      <div className="h-1.5 grid grid-cols-3"><div className="bg-[#CE1126]"></div><div className="bg-[#FCD116]"></div><div className="bg-[#006B3F]"></div></div>
      <section className="max-w-7xl mx-auto px-6 pt-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <div><h1 className="text-[56px] font-black leading-[0.9]">Credit for<br/> every<br/> Ghanaian.</h1><div className="mt-6 flex gap-3"><button onClick={()=>goApp('dashboard')} className="h-12 px-6 rounded-full bg-[#0A2A8A] text-white font-semibold">Open App →</button></div></div>
        <div className="rounded-[28px] bg-white border p-6 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white border shadow-sm"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div>
          <div className="mt-4 text-4xl font-black">{score}</div><div className="text-xs text-zinc-500">Akwaaba Score • Fixed Logo</div><button onClick={()=>goApp('dashboard')} className="mt-6 w-full h-12 rounded-full bg-[#0A2A8A] text-white font-semibold">Open Dashboard →</button></div>
      </section>
    </main>
  )
}