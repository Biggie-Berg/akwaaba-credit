'use client';
import { useState, useEffect } from 'react';
type Page = 'dashboard'|'loans'|'repayments'|'momo'|'settings'|'users'|'admin'|'ceo'|'defaulters'|'dormant'|'landing'|'apply';

const GHANA_REGIONS: any = {
  "Greater Accra": ["Accra","Tema","Madina","Kasoa","Ashaiman","Nungua","Spintex","East Legon","Weija","Teshie"],
  "Ashanti": ["Kumasi","Obuasi","Ejisu","Konongo","Mampong","Bekwai","Offinso","Tafo"],
  "Central": ["Cape Coast","Winneba","Kasoa","Swedru","Elmina","Mankessim","Saltpond"],
  "Eastern": ["Koforidua","Nkawkaw","Akim Oda","Nsawam","Suhum","Akim Tafo","Abetifi","Akwatia"],
  "Western": ["Takoradi","Tarkwa","Axim","Sekondi","Agona Nkwanta","Bogoso"],
  "Western North": ["Sefwi Wiawso","Bibiani","Enchi","Juaboso"],
  "Volta": ["Ho","Hohoe","Aflao","Keta","Kpando","Sogakope","Dzodze"],
  "Oti": ["Dambai","Jasikan","Kadjebi","Nkwanta"],
  "Northern": ["Tamale","Yendi","Savelugu","Tolon","Gushegu"],
  "Savannah": ["Damongo","Bole","Salaga","Buipe"],
  "North East": ["Nalerigu","Walewale","Gambaga"],
  "Upper East": ["Bolgatanga","Bawku","Navrongo","Paga","Bongo"],
  "Upper West": ["Wa","Tumu","Nandom","Jirapa","Lawra"],
  "Bono": ["Sunyani","Berekum","Dormaa","Wenchi","Bechem"],
  "Bono East": ["Techiman","Kintampo","Atebubu","Nkoranza"],
  "Ahafo": ["Goaso","Bechem","Duayaw Nkwanta","Kenyasi","Hwidiem"]
};

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
  const [form, setForm] = useState<any>({
    idType:'Ghana Card', idNumber:'', name:'', phone:'', 
    region:'Greater Accra', town:'Accra',
    gps:'', purpose:'Business', amount:'', education:'SHS', profession:'', 
    g1Name:'', g1Phone:'', g2Name:'', g2Phone:'',
    cardFront:'', cardBack:'', selfie:''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(()=>{
    const saved = localStorage.getItem('akwaaba_loans_v2');
    if(saved) setLoans(JSON.parse(saved));
  },[]);
  useEffect(()=>{
    localStorage.setItem('akwaaba_loans_v2', JSON.stringify(loans));
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
  const handleFile = (key:string, e:any) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleForm(key, ev.target?.result);
    reader.readAsDataURL(file);
  }
  const submitLoan = () => {
    if(!form.name || !form.phone || !form.idNumber || !form.amount || !form.cardFront || !form.cardBack || !form.selfie){
      alert('Please fill all * fields + upload Front, Back and Selfie');
      return;
    }
    const newLoan = {
      id: 'LN-'+Date.now().toString().slice(-6),
      ...form,
      amountValue: Number(String(form.amount).replace(/[^0-9]/g,'')) || 0,
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
            {/* NORMAL USER MENU - CLEAN */}
            <button onClick={()=>setTab('dashboard')} className={`w-full text-left ${isActive('dashboard')}`}>Dashboard</button>
            <button onClick={()=>setTab('apply')} className={`w-full text-left ${isActive('apply')}`}>Apply for Loan 📝</button>
            
            {loans.length > 0 && (
              <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>My Loans ({loans.length})</button>
            )}

            {/* STAFF ONLY SECTION */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="text-[10px] tracking-widest text-zinc-600 mb-3 px-4">STAFF LOGIN</div>
              <button onClick={()=>goApp('admin')} className={`w-full text-left ${isActive('admin')}`}>Staff / Admin</button>
              <button onClick={()=>goApp('ceo')} className={`w-full text-left ${isActive('ceo')}`}>CEO</button>
            </div>

            {/* SHOW THESE ONLY AFTER ADMIN OR CEO LOGIN */}
            {(adminAuth || ceoAuth) && (
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="text-[10px] tracking-widest text-zinc-500 mb-3 px-4">ADMIN PANEL</div>
                <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>All Loans ({loans.length})</button>
                <button onClick={()=>setTab('repayments')} className={`w-full text-left ${isActive('repayments')}`}>Repayments</button>
                <button onClick={()=>setTab('defaulters')} className={`w-full text-left ${isActive('defaulters')}`}>Defaulters</button>
                <button onClick={()=>setTab('dormant')} className={`w-full text-left ${isActive('dormant')}`}>Dormant</button>
                <button onClick={()=>setTab('settings')} className={`w-full text-left ${isActive('settings')}`}>Settings</button>
              </div>
            )}
          </div>
          <button onClick={()=>setView('landing')} className="mt-6 text-xs underline text-zinc-400">← Back to site</button>
        </aside>

        <section className="flex-1 min-w-0">
          <header className="h-[70px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3"><Logo size={36}/><span className="text-xs text-zinc-400 capitalize">| {tab} • {loans.length} Records</span></div>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div>
          </header>

          <div className="p-6 max-w-5xl mx-auto">
            {tab==='dashboard' && (<><h1 className="text-3xl font-black">Akwaaba, Kwame! 👋</h1><p className="text-sm text-zinc-500 mt-1">Your credit hub • Apply and track loans</p><div className="mt-6 grid md:grid-cols-3 gap-4"><div className="rounded-2xl bg-white border p-5"><div className="text-xs">My Loans</div><div className="text-3xl font-black">{loans.length}</div></div><div className="rounded-2xl bg-white border p-5"><div className="text-xs">Available to Borrow</div><div className="text-3xl font-black">₵2,500</div></div><div className="rounded-2xl bg-[#0A2A8A] text-white p-5"><div className="text-xs text-zinc-300">Credit Score</div><div className="text-3xl font-black">{score}</div></div></div><button onClick={()=>setTab('apply')} className="mt-6 h-12 px-8 rounded-full bg-[#0A2A8A] text-white font-bold">+ Apply for Loan</button></>)}
            
            {tab==='apply' && (
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6 border-b pb-4"><div className="w-14 h-14 rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div><h2 className="text-xl font-black text-[#0A2A8A]">AKWAABA CREDIT</h2><p className="text-xs text-zinc-500">Loan Application • Ghana Regions + Uploads</p></div></div>
                {!submitted ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold">Full Name *</label><input value={form.name} onChange={e=>handleForm('name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="Kwame Asante Boateng"/></div>
                    <div><label className="text-xs font-semibold">Telephone Number *</label><input value={form.phone} onChange={e=>handleForm('phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="0244 123 456"/></div>
                    <div><label className="text-xs font-semibold">Region *</label><select value={form.region} onChange={e=>{handleForm('region',e.target.value); handleForm('town', GHANA_REGIONS[e.target.value][0])}} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white">{Object.keys(GHANA_REGIONS).map(r=><option key={r}>{r}</option>)}</select></div>
                    <div><label className="text-xs font-semibold">Town / City *</label><select value={form.town} onChange={e=>handleForm('town',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white">{GHANA_REGIONS[form.region]?.map((t:string)=><option key={t}>{t}</option>)}</select></div>
                    <div><label className="text-xs font-semibold">Type of Card *</label><select value={form.idType} onChange={e=>handleForm('idType',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white"><option>Ghana Card</option><option>Voter's Card</option><option>Passport</option></select></div>
                    <div className="bg-[#FFF8DB] border-2 border-[#FCD116] rounded-xl p-3"><label className="text-xs font-bold text-[#0A2A8A]">{form.idType} Number *</label><input value={form.idNumber} onChange={e=>handleForm('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm font-mono" placeholder="GHA-123456789-0"/></div>
                    <div><label className="text-xs font-semibold">GPS Digital Address *</label><input value={form.gps} onChange={e=>handleForm('gps',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="GA-123-4567"/></div>
                    <div><label className="text-xs font-semibold">Amount *</label><input value={form.amount} onChange={e=>handleForm('amount',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm" placeholder="2500"/></div>
                    <div className="md:col-span-2 mt-2 border-t pt-4 font-bold text-sm">Guarantors</div>
                    <div><label className="text-xs">Guarantor 1 Name</label><input value={form.g1Name} onChange={e=>handleForm('g1Name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 1 Telephone *</label><input value={form.g1Phone} onChange={e=>handleForm('g1Phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 2 Name</label><input value={form.g2Name} onChange={e=>handleForm('g2Name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div><label className="text-xs">Guarantor 2 Telephone *</label><input value={form.g2Phone} onChange={e=>handleForm('g2Phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl text-sm"/></div>
                    <div className="md:col-span-2 mt-4 border-t pt-4 font-black text-sm">Upload Documents</div>
                    <div><label className="text-xs font-bold">Ghana Card Front *</label><input type="file" accept="image/*" onChange={e=>handleFile('cardFront',e)} className="mt-1 w-full text-sm border rounded-xl p-2"/>{form.cardFront && <img src={form.cardFront} className="mt-2 h-32 rounded-xl border object-cover w-full"/>}</div>
                    <div><label className="text-xs font-bold">Ghana Card Back *</label><input type="file" accept="image/*" onChange={e=>handleFile('cardBack',e)} className="mt-1 w-full text-sm border rounded-xl p-2"/>{form.cardBack && <img src={form.cardBack} className="mt-2 h-32 rounded-xl border object-cover w-full"/>}</div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">Selfie with Ghana Card *</label><input type="file" accept="image/*" onChange={e=>handleFile('selfie',e)} className="mt-1 w-full text-sm border rounded-xl p-2"/>{form.selfie && <img src={form.selfie} className="mt-2 h-48 rounded-xl border object-cover"/>}</div>
                    <div className="md:col-span-2 mt-6"><button onClick={submitLoan} className="w-full h-12 rounded-full bg-[#0A2A8A] text-white font-bold">Submit Application ✓</button></div>
                  </div>
                ) : (<div className="text-center py-10"><div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white border"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div><div className="mt-4 text-2xl font-black">Application Received!</div><div className="text-sm text-zinc-500">{form.region} • {form.town} • {form.idType} • {form.idNumber}</div><button onClick={()=>{setSubmitted(false); setForm({idType:'Ghana Card', idNumber:'', name:'', phone:'', region:'Greater Accra', town:'Accra', gps:'', purpose:'Business', amount:'', education:'SHS', profession:'', g1Name:'', g1Phone:'', g2Name:'', g2Phone:'', cardFront:'', cardBack:'', selfie:''})}} className="mt-6 h-11 px-6 rounded-full border">Apply again</button><button onClick={()=>setTab('loans')} className="mt-2 ml-2 h-11 px-6 rounded-full bg-black text-white">View My Loans →</button></div>)}
              </div>
            )}

            {tab==='ceo' && !ceoAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="font-black">CEO Login 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="CEO2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('ceo')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock</button></div>}
            {tab==='ceo' && ceoAuth && <div><h2 className="text-2xl font-bold">CEO Dashboard 👑 🔓</h2><div className="mt-4 bg-white border rounded-xl p-4"><table className="w-full text-sm"><thead><tr className="text-left text-zinc-500"><th>ID</th><th>Name</th><th>Region</th><th>Amount</th><th>Status</th></tr></thead><tbody>{loans.map(l=><tr key={l.id} className="border-t"><td className="py-2 font-mono text-xs">{l.id}</td><td>{l.name}</td><td>{l.region}</td><td>₵{l.amountValue}</td><td>{l.status}</td></tr>)}</tbody></table></div></div>}

            {tab==='admin' && !adminAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto mt-10 text-center"><div className="font-black">Admin Login 🔐</div><input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="ADMIN2026" className="mt-6 w-full h-11 px-4 border rounded-xl"/><button onClick={()=>tryAuth('admin')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock</button></div>}
            {tab==='admin' && adminAuth && <div><h2 className="text-2xl font-bold">Admin - Verify Documents</h2><div className="mt-4 space-y-4">{loans.map(l=><div key={l.id} className="bg-white border rounded-xl p-4"><div className="flex justify-between"><div><b>{l.name}</b> • {l.region}/{l.town}<br/><span className="text-xs">{l.id} • {l.idNumber} • ₵{l.amountValue} • {l.status}</span></div><div className="flex gap-2"><button onClick={()=>updateStatus(l.id,'Approved')} className="h-8 px-3 rounded-full bg-green-600 text-white text-xs">Approve</button><button onClick={()=>updateStatus(l.id,'Rejected')} className="h-8 px-3 rounded-full bg-red-600 text-white text-xs">Reject</button></div></div><div className="mt-3 grid grid-cols-3 gap-2">{l.cardFront && <img src={l.cardFront} className="h-24 w-full object-cover rounded border"/>}{l.cardBack && <img src={l.cardBack} className="h-24 w-full object-cover rounded border"/>}{l.selfie && <img src={l.selfie} className="h-24 w-full object-cover rounded border"/>}</div></div>)}{loans.length===0 && <div className="bg-white border rounded-xl p-10 text-center text-zinc-400">No loans yet</div>}</div></div>}

            {tab==='loans' && <div><h2 className="text-2xl font-bold">Loans ({loans.length})</h2><div className="mt-4 bg-white border rounded-xl p-4 overflow-auto"><table className="w-full text-sm"><thead><tr className="text-left text-zinc-500"><th>ID</th><th>Name</th><th>Region</th><th>Amount</th><th>Status</th></tr></thead><tbody>{loans.map(l=><tr key={l.id} className="border-t"><td className="py-2 font-mono text-xs">{l.id}</td><td>{l.name}</td><td>{l.region}</td><td>₵{l.amountValue}</td><td>{l.status}</td></tr>)}</tbody></table></div></div>}

            {(tab==='repayments' || tab==='defaulters' || tab==='dormant' || tab==='settings') && !(adminAuth || ceoAuth) && <div className="bg-white border rounded-xl p-10 text-center mt-10"><div className="font-bold">Staff Only</div><div className="text-sm text-zinc-500">Please login as Admin to view {tab}</div><button onClick={()=>setTab('admin')} className="mt-4 h-11 px-6 rounded-full bg-black text-white">Staff Login</button></div>}

            {tab==='repayments' && (adminAuth || ceoAuth) && <div><h2 className="text-2xl font-bold">Repayments</h2><div className="mt-4 bg-white border rounded-xl p-4"><table className="w-full text-sm"><thead><tr className="text-left"><th>Name</th><th>Region</th><th>Loan</th><th>Status</th></tr></thead><tbody>{loans.filter(l=>l.status==='Approved').map(l=><tr key={l.id} className="border-t"><td className="py-2">{l.name}</td><td>{l.region}</td><td>₵{l.amountValue}</td><td>{l.status}</td></tr>)}</tbody></table></div></div>}

            {(tab==='defaulters' || tab==='dormant' || tab==='settings') && (adminAuth || ceoAuth) && <div className="bg-white border rounded-xl p-6 mt-4"><div className="font-bold capitalize">{tab} Page</div><div className="text-sm text-zinc-500 mt-2">Total: {loans.length} • Portfolio: ₵{loans.reduce((s,l)=>s+l.amountValue,0).toLocaleString()}</div></div>}
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
          <div className="mt-4 text-4xl font-black">{score}</div><div className="text-xs text-zinc-500">Akwaaba Score • {loans.length} Loans • Clean User View</div><button onClick={()=>goApp('dashboard')} className="mt-6 w-full h-12 rounded-full bg-[#0A2A8A] text-white font-semibold">Open Dashboard →</button></div>
      </section>
    </main>
  )
}