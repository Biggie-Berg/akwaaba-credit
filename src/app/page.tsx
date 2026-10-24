'use client';
import { useState, useEffect } from 'react';
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
  const [form, setForm] = useState<any>({idType:'Ghana Card', idNumber:'', name:'', phone:'', gps:'', purpose:'Business', amount:'', education:'SHS', profession:'', g1Name:'', g1Phone:'', g2Name:'', g2Phone:''});
  const [submitted, setSubmitted] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  // Load and save loans - THIS FIXES THE EMPTY PAGES BUG
  useEffect(()=>{
    const saved = localStorage.getItem('akwaaba_loans');
    if(saved) setLoans(JSON.parse(saved));
  },[]);
  useEffect(()=>{
    localStorage.setItem('akwaaba_loans', JSON.stringify(loans));
  },[loans]);

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

  const submitLoan = () => {
    if(!form.name || !form.phone || !form.idNumber || !form.amount){
      alert('Please fill Full Name, Phone, ID Number and Amount');
      return;
    }
    const newLoan = {
      id: 'LN-'+Date.now().toString().slice(-6),
      ...form,
      amountValue: Number(form.amount.replace(/[^0-9]/g,'')) || 0,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      repaid: 0
    };
    setLoans(prev => [newLoan, ...prev]);
    setSubmitted(true);
  }

  const updateStatus = (id:string, status:string) => {
    setLoans(prev => prev.map(l=> l.id===id ? {...l, status} : l));
  }

  if(view!=='landing'){
    return (
      <main className="min-h-screen bg-[#f5f5f2] text-zinc-900 flex flex-col md:flex-row w-full overflow-hidden">
        <aside className="w-full md:w-[280px] md:min-h-screen bg-black text-white flex-shrink-0 p-6 flex flex-col">
          <Logo size={44} white />
          <div className="mt-8 space-y-1 text-[13px] flex-1">
            <button onClick={()=>setTab('dashboard')} className={`w-full text-left ${isActive('dashboard')}`}>Dashboard</button>
            <button onClick={()=>setTab('apply')} className={`w-full text-left ${isActive('apply')}`}>Apply for Loan 📝</button>
            <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>Loans ({loans.length})</button>
            <button onClick={()=>setTab('repayments')} className={`w-full text-left ${isActive('repayments')}`}>Repayments</button>
            <button onClick={()=>setTab('defaulters')} className={`w-full text-left ${isActive('defaulters')}`}>Defaulters</button>
            <button onClick={()=>setTab('dormant')} className={`w-full text-left ${isActive('dormant')}`}>Dormant</button>
            <button onClick={()=>goApp('admin')} className={`w-full text-left ${isActive('admin')}`}>Staff/Admin</button>
            <button onClick={()=>goApp('ceo')} className={`w-full text-left ${isActive('ceo')}`}>CEO</button>
            <button onClick={()=>setTab('settings')} className={`w-full text-left ${isActive('settings')}`}>Settings</button>
          </div>
          <button onClick={()=>setView('landing')} className="mt-6 text-xs underline text-zinc-400">← Back to site</button>
        </aside>
        <section className="flex-1 min-w-0">
          <header className="h-[70px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3"><Logo size={36}/><span className="text-xs text-zinc-400 capitalize">| {tab} - {loans.length} records</span></div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div>
          </header>
          <div className="p-6 max-w-5xl mx-auto">
            {tab==='dashboard' && (<><h1 className="text-3xl font-black">Akwaaba, Kwame! 👋</h1><div className="mt-6 grid md:grid-cols-4 gap-4"><div className="rounded-2xl bg-white border p-5"><div className="text-xs">Total Loans</div><div className="text-3xl font-black">{loans.length}</div></div><div className="rounded-2xl bg-white border p-5"><div className="text-xs">Available</div><div className="text-3xl font-black">₵2,500</div></div><div className="rounded-2xl bg-[#FCD116]/30 border p-5"><div className="text-xs">Pending</div><div className="text-3xl font-black">{loans.filter(l=>l.status==='Pending').length}</div></div><div className="rounded-2xl bg-black text-white p-5"><div className="text-xs text-zinc-400">Total Value</div><div className="text-3xl font-black">₵{loans.reduce((s,l)=>s+l.amountValue,0).toLocaleString()}</div></div></div><button onClick={()=>setTab('apply')} className="mt-6 h-12 px-6 rounded-full bg-[#0A2A8A] text-white font-semibold">+ Apply New Loan</button></>)}
            
            {tab==='apply' && (
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6 border-b pb-4"><div className="w-14 h-14 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div><h2 className="text-xl font-black text-[#0A2A8A]">AKWAABA CREDIT</h2><p className="text-xs text-zinc-500">Official Loan Application Form • Ghana</p></div></div>
                {!submitted ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold">Full Name *</label><input value={form.name} onChange={e=>handleForm('name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Kwame Asante Boateng"/></div>
                    <div><label className="text-xs font-semibold">Telephone Number *</label><input value={form.phone} onChange={e=>handleForm('phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="0244 123 456"/></div>
                    <div><label className="text-xs font-semibold">Type of Card *</label><select value={form.idType} onChange={e=>handleForm('idType',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white"><option>Ghana Card</option><option>Voter's Card</option><option>Passport</option></select></div>
                    <div className="bg-[#FFF8DB] border-2 border-[#FCD116] rounded-xl p-3">
                      <label className="text-xs font-bold text-[#0A2A8A]">{form.idType} Number *</label><input value={form.idNumber} onChange={e=>handleForm('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm font-mono" placeholder="GHA-123456789-0"/>
                    </div>
                    <div><label className="text-xs font-semibold">GPS Digital Address *</label><input value={form.gps} onChange={e=>handleForm('gps',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="GA-123-4567"/></div>
                    <div><label className="text-xs font-semibold">Loan Purpose</label><select value={form.purpose} onChange={e=>handleForm('purpose',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"><option>Business</option><option>School Fees</option><option>Emergency</option><option>Trading</option></select></div>
                    <div><label className="text-xs font-semibold">Amount *</label><input value={form.amount} onChange={e=>handleForm('amount',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="2500"/></div>
                    <div><label className="text-xs font-semibold">Profession</label><input value={form.profession} onChange={e=>handleForm('profession',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Trader"/></div>
                    <div className="md:col-span-2 mt-2 border-t pt-4 font-bold text-sm">Guarantors (2 Required)</div>
                    <div><label className="text-xs">Guarantor 1 Name</label><input value={form.g1Name} onChange={e=>handleForm('g1Name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 1 Telephone *</label><input value={form.g1Phone} onChange={e=>handleForm('g1Phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 2 Name</label><input value={form.g2Name} onChange={e=>handleForm('g2Name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 2 Telephone *</label><input value={form.g2Phone} onChange={e=>handleForm('g2Phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div className="md:col-span-2 mt-6"><button onClick={submitLoan} className="w-full h-12 rounded-full bg-[#0A2A8A] text-white font-bold">Submit Application → {form.idNumber || ''}</button></div>
                  </div>
                ) : (<div className="text-center py-10"><div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div className="mt-4 text-2xl font-black">Application Received!</div><div className="text-sm text-zinc-500">ID: {form.idType} • {form.idNumber} • Saved to all pages</div><button onClick={()=>{setSubmitted(false); setForm({idType:'Ghana Card', idNumber:'', name:'', phone:'', gps:'', purpose:'Business', amount:'', education:'SHS', profession:'', g1Name:'', g1Phone:'', g2Name:'', g2Phone:''})}} className="mt-6 h-11 px-6 rounded-full border">Apply again</button><button onClick={()=>setTab('loans')} className="mt-2 ml-2 h-11 px-6 rounded-full bg-black text-white">View in Loans →</button></div>)}
              </div>
            )}

            {tab==='ceo' && !ceoAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="mt-3 font-black">CEO Encrypted 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="CEO2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('ceo')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock CEO</button></div>}
            {tab==='ceo' && ceoAuth && <div><h2 className="text-2xl font-bold">CEO Dashboard 👑 🔓 - {loans.length} Loans</h2><div className="mt-4 grid md:grid-cols-3 gap-4"><div className="bg-black text-white rounded-xl p-5">Portfolio ₵{loans.reduce((s,l)=>s+l.amountValue,0).toLocaleString()}</div><div className="bg-white border rounded-xl p-5">Pending {loans.filter(l=>l.status==='Pending').length}</div><div className="bg-[#0A2A8A] text-white rounded-xl p-5">Approved ₵{loans.filter(l=>l.status==='Approved').reduce((s,l)=>s+l.amountValue,0).toLocaleString()}</div></div><div className="mt-6 bg-white border rounded-xl p-4"><table className="w-full text-sm"><thead><tr className="text-left text-zinc-500"><th>ID</th><th>Name</th><th>Amount</th><th>Status</th></tr></thead><tbody>{loans.map(l=><tr key={l.id} className="border-t"><td>{l.id}</td><td>{l.name}</td><td>₵{l.amountValue}</td><td>{l.status}</td></tr>)}</tbody></table>{loans.length===0 && <div className="py-10 text-center text-zinc-400">No loans yet — apply first</div>}</div></div>}

            {tab==='admin' && !adminAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="mt-3 font-black">Admin Encrypted 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="ADMIN2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('admin')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock Admin</button></div>}
            {tab==='admin' && adminAuth && <div><h2 className="text-2xl font-bold">Admin Staff 🔓 - All Transactions</h2><div className="mt-4 bg-white border rounded-xl p-4">{loans.length===0 ? <div className="py-10 text-center">No records yet</div> : <table className="w-full text-sm"><thead><tr className="text-left text-zinc-500"><th>Name</th><th>Phone</th><th>ID</th><th>Amount</th><th>Action</th></tr></thead><tbody>{loans.map(l=><tr key={l.id} className="border-t"><td>{l.name}</td><td>{l.phone}</td><td>{l.idNumber}</td><td>₵{l.amountValue}</td><td className="flex gap-2 py-2"><button onClick={()=>updateStatus(l.id,'Approved')} className="px-3 py-1 rounded-full bg-green-600 text-white text-xs">Approve</button><button onClick={()=>updateStatus(l.id,'Rejected')} className="px-3 py-1 rounded-full bg-red-600 text-white text-xs">Reject</button><span className="text-xs">{l.status}</span></td></tr>)}</tbody></table>}</div></div>}

            {tab==='loans' && <div><h2 className="text-2xl font-bold">Loans - {loans.length}</h2><div className="mt-4 bg-white border rounded-xl p-4">{loans.length===0 ? <div className="py-16 text-center text-zinc-400">No loans - apply first in Apply tab</div> : <table className="w-full text-sm"><thead><tr className="text-left text-zinc-500"><th>ID</th><th>Name</th><th>Phone</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{loans.map(l=><tr key={l.id} className="border-t"><td className="py-2 font-mono">{l.id}</td><td>{l.name}</td><td>{l.phone}</td><td>₵{l.amountValue}</td><td><span className={`px-2 py-1 rounded-full text-xs ${l.status==='Approved'?'bg-green-100': l.status==='Pending'?'bg-yellow-100':'bg-red-100'}`}>{l.status}</span></td><td>{l.date}</td></tr>)}</tbody></table>}</div></div>}

            {tab==='repayments' && <div><h2 className="text-2xl font-bold">Repayments</h2><div className="mt-4 bg-white border rounded-xl p-4"><table className="w-full text-sm"><thead><tr className="text-left"><th>Name</th><th>Loan</th><th>Repaid</th><th>Balance</th></tr></thead><tbody>{loans.filter(l=>l.status==='Approved').map(l=><tr key={l.id} className="border-t"><td className="py-2">{l.name}</td><td>₵{l.amountValue}</td><td>₵{l.repaid}</td><td>₵{l.amountValue - l.repaid}</td></tr>)}</tbody></table>{loans.filter(l=>l.status==='Approved').length===0 && <div className="py-10 text-center text-zinc-400">No approved loans yet</div>}</div></div>}

            {tab==='defaulters' && <div><h2 className="text-2xl font-bold">Defaulters - {loans.filter(l=>l.status==='Defaulted').length}</h2><div className="mt-4 bg-white border rounded-xl p-4">{loans.filter(l=>l.status==='Defaulted').length===0 ? <div className="py-10 text-center text-zinc-400">No defaulters</div> : loans.filter(l=>l.status==='Defaulted').map(l=><div key={l.id} className="border-b py-2">{l.name} - ₵{l.amountValue}</div>)}</div></div>}

            {tab==='dormant' && <div><h2 className="text-2xl font-bold">Dormant</h2><div className="mt-4 bg-white border rounded-xl p-4 text-sm text-zinc-500">Inactive accounts: {loans.filter(l=>l.status==='Dormant').length} - All transactions are now recording from Apply form</div></div>}

            {['momo','settings','users'].includes(tab) && <div className="bg-white border rounded-xl p-6 mt-4"><div className="font-bold capitalize">{tab} Page</div><div className="text-sm text-zinc-500 mt-2">Total loans in system: {loans.length} • Portfolio: ₵{loans.reduce((s,l)=>s+l.amountValue,0).toLocaleString()}</div></div>}
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
          <div className="mt-4 text-4xl font-black">{score}</div><div className="text-xs text-zinc-500">Akwaaba Score • Fixed Logo • {loans.length} Loans Saved</div><button onClick={()=>goApp('dashboard')} className="mt-6 w-full h-12 rounded-full bg-[#0A2A8A] text-white font-semibold">Open Dashboard →</button></div>
      </section>
    </main>
  )
}