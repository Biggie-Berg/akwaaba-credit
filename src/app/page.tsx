'use client';
import { useState, useEffect } from 'react';
type Page = 'dashboard'|'loans'|'repayments'|'admin'|'ceo'|'defaulters'|'dormant'|'settings'|'landing'|'apply';

const REGIONS: any = {
  "Greater Accra": ["Accra","Tema","Madina","Kasoa","Ashaiman"],
  "Ashanti": ["Kumasi","Obuasi","Ejisu","Konongo"],
  "Central": ["Cape Coast","Winneba","Elmina"],
  "Eastern": ["Koforidua","Nkawkaw","Akim Oda"],
  "Western": ["Takoradi","Tarkwa","Axim"],
  "Volta": ["Ho","Hohoe","Aflao","Keta"],
  "Northern": ["Tamale","Yendi","Savelugu"],
  "Upper East": ["Bolgatanga","Bawku"],
  "Upper West": ["Wa","Tumu"],
  "Bono": ["Sunyani","Berekum"],
  "Bono East": ["Techiman","Kintampo"],
  "Ahafo": ["Goaso","Bechem"],
  "Western North": ["Sefwi Wiawso","Bibiani"],
  "Oti": ["Dambai","Jasikan"],
  "North East": ["Nalerigu","Walewale"],
  "Savannah": ["Damongo","Bole"]
};

function Logo({size=36, white=false}:{size?:number, white?:boolean}){
  return (
    <div className="flex items-center gap-2.5">
      <div style={{width:size, height:size}} className="rounded-full overflow-hidden bg-white border flex items-center justify-center">
        <img src="/logo.png" alt="logo" className="w-[92%] h-[92%] object-contain" />
      </div>
      <div className="leading-[0.9]">
        <div className={`font-black ${white ? 'text-white' : 'text-[#0A2A8A]'}`} style={{fontSize:size*0.42}}>AKWAABA</div>
        <div className={`font-bold tracking-[0.18em] ${white ? 'text-zinc-400' : 'text-[#0A2A8A]'}`} style={{fontSize:size*0.24}}>CREDIT</div>
      </div>
    </div>
  )
}

export default function Page(){
  const [view, setView] = useState<Page>('landing');
  const [tab, setTab] = useState<Page>('dashboard');
  const [isBoss, setIsBoss] = useState(false);
  const [ceoAuth, setCeoAuth] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [form, setForm] = useState<any>({name:'',phone:'',region:'Greater Accra',town:'Accra',idNumber:'',amount:'',cardFront:'',cardBack:'',selfie:''});
  const [submitted, setSubmitted] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    if(p.has('boss')) setIsBoss(true);
    const s = localStorage.getItem('akwaaba_loans_v2');
    if(s) setLoans(JSON.parse(s));
  },[]);
  useEffect(()=>{localStorage.setItem('akwaaba_loans_v2', JSON.stringify(loans))},[loans]);

  const isActive = (p:Page)=> tab===p ? 'bg-white text-black rounded-full px-4 py-2 font-semibold' : 'px-4 py-2 text-zinc-400 hover:text-white';
  const handle = (k:string,v:any)=> setForm((f:any)=>({...f,[k]:v}));
  const file = (k:string,e:any)=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=(ev)=>handle(k, ev.target?.result); r.readAsDataURL(f);
  };
  const submit = ()=>{
    if(!form.name||!form.phone||!form.idNumber||!form.amount||!form.cardFront||!form.cardBack||!form.selfie){alert('Fill all + uploads'); return;}
    const nl={id:'LN-'+Date.now().toString().slice(-6),...form,amountValue:Number(String(form.amount).replace(/[^0-9]/g,''))||0,status:'Pending',date:new Date().toLocaleDateString()};
    setLoans(o=>[nl,...o]); setSubmitted(true);
  };
  const update = (id:string,s:string)=> setLoans(o=>o.map(l=>l.id===id?{...l,status:s}:l));
  const go = (p:Page)=>{
    if(p==='ceo'&&!ceoAuth){setTab('ceo'); setView('dashboard'); return;}
    if(p==='admin'&&!adminAuth){setTab('admin'); setView('dashboard'); return;}
    setTab(p); setView('dashboard');
  };
  const auth = (t:Page)=>{
    if(t==='ceo'&&pass==='CEO2026') setCeoAuth(true);
    if(t==='admin'&&pass==='ADMIN2026') setAdminAuth(true);
  };

  if(view!=='landing'){
    return (
      <main className="min-h-screen bg-[#f5f5f2] flex flex-col md:flex-row">
        <aside className="w-full md:w-[280px] bg-black text-white p-6 flex flex-col">
          <Logo size={44} white />
          {isBoss && <div className="mt-3 text-[10px] bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-center">BOSS MODE</div>}
          <div className="mt-6 space-y-1 text-[13px] flex-1">
            <button onClick={()=>setTab('dashboard')} className={`w-full text-left ${isActive('dashboard')}`}>Dashboard</button>
            <button onClick={()=>setTab('apply')} className={`w-full text-left ${isActive('apply')}`}>Apply for Loan 📝</button>
            {loans.length>0 && <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>My Loans ({loans.length})</button>}
            
            {isBoss ? (
              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-1">
                <div className="text-[10px] text-zinc-500 px-4 mb-2">FULL MENU - BOSS LINK</div>
                <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>Loans ({loans.length})</button>
                <button onClick={()=>setTab('repayments')} className={`w-full text-left ${isActive('repayments')}`}>Repayments</button>
                <button onClick={()=>setTab('defaulters')} className={`w-full text-left ${isActive('defaulters')}`}>Defaulters</button>
                <button onClick={()=>setTab('dormant')} className={`w-full text-left ${isActive('dormant')}`}>Dormant</button>
                <button onClick={()=>go('admin')} className={`w-full text-left ${isActive('admin')}`}>Staff/Admin</button>
                <button onClick={()=>go('ceo')} className={`w-full text-left ${isActive('ceo')}`}>CEO</button>
                <button onClick={()=>setTab('settings')} className={`w-full text-left ${isActive('settings')}`}>Settings</button>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-1">
                <div className="text-[10px] text-zinc-600 px-4 mb-2">STAFF LOGIN</div>
                <button onClick={()=>go('admin')} className={`w-full text-left ${isActive('admin')}`}>Staff / Admin</button>
                <button onClick={()=>go('ceo')} className={`w-full text-left ${isActive('ceo')}`}>CEO</button>
              </div>
            )}

            {(adminAuth||ceoAuth) && !isBoss && (
              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-1">
                <div className="text-[10px] text-zinc-500 px-4 mb-2">ADMIN PANEL</div>
                <button onClick={()=>setTab('loans')} className={`w-full text-left ${isActive('loans')}`}>All Loans</button>
                <button onClick={()=>setTab('repayments')} className={`w-full text-left ${isActive('repayments')}`}>Repayments</button>
                <button onClick={()=>setTab('defaulters')} className={`w-full text-left ${isActive('defaulters')}`}>Defaulters</button>
                <button onClick={()=>setTab('dormant')} className={`w-full text-left ${isActive('dormant')}`}>Dormant</button>
              </div>
            )}
          </div>
          <button onClick={()=>setView('landing')} className="mt-6 text-xs underline text-zinc-400">← Back to site</button>
        </aside>

        <section className="flex-1">
          <header className="h-[70px] bg-white border-b flex items-center justify-between px-6 sticky top-0">
            <div className="flex items-center gap-3"><Logo size={36}/><span className="text-xs text-zinc-400">| {tab} {isBoss?'(BOSS)':''}</span></div>
            <div className="w-9 h-9 rounded-full border overflow-hidden"><img src="/logo.png" className="w-full h-full object-contain p-1"/></div>
          </header>
          <div className="p-6 max-w-5xl mx-auto">
            {tab==='dashboard' && (
              <div>
                <h1 className="text-3xl font-black">Akwaaba! 👋 {isBoss?'👑':''}</h1>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-white border rounded-2xl p-5"><div className="text-xs">Loans</div><div className="text-3xl font-black">{loans.length}</div></div>
                  <div className="bg-white border rounded-2xl p-5"><div className="text-xs">Available</div><div className="text-3xl font-black">₵2,500</div></div>
                  <div className="bg-[#0A2A8A] text-white rounded-2xl p-5"><div className="text-xs">Score</div><div className="text-3xl font-black">742</div></div>
                </div>
                <button onClick={()=>setTab('apply')} className="mt-6 h-12 px-8 rounded-full bg-[#0A2A8A] text-white font-bold">+ Apply</button>
              </div>
            )}

            {tab==='apply' && (
              <div className="bg-white border rounded-2xl p-6">
                {!submitted ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 font-black text-[#0A2A8A] border-b pb-3">AKWAABA CREDIT - Application</div>
                    <div><label className="text-xs font-semibold">Full Name *</label><input value={form.name} onChange={e=>handle('name',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl"/></div>
                    <div><label className="text-xs font-semibold">Phone *</label><input value={form.phone} onChange={e=>handle('phone',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl"/></div>
                    <div><label className="text-xs font-semibold">Region *</label><select value={form.region} onChange={e=>{handle('region',e.target.value); handle('town', REGIONS[e.target.value][0])}} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white">{Object.keys(REGIONS).map(r=><option key={r}>{r}</option>)}</select></div>
                    <div><label className="text-xs font-semibold">Town *</label><select value={form.town} onChange={e=>handle('town',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl bg-white">{REGIONS[form.region]?.map((t:string)=><option key={t}>{t}</option>)}</select></div>
                    <div><label className="text-xs font-semibold">Ghana Card Number *</label><input value={form.idNumber} onChange={e=>handle('idNumber',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl"/></div>
                    <div><label className="text-xs font-semibold">Amount *</label><input value={form.amount} onChange={e=>handle('amount',e.target.value)} className="mt-1 w-full h-11 px-3 border rounded-xl"/></div>
                    <div><label className="text-xs font-bold">Front *</label><input type="file" accept="image/*" onChange={e=>file('cardFront',e)} className="mt-1 w-full border rounded-xl p-2 text-sm"/>{form.cardFront && <img src={form.cardFront} className="mt-2 h-24 rounded border object-cover w-full"/>}</div>
                    <div><label className="text-xs font-bold">Back *</label><input type="file" accept="image/*" onChange={e=>file('cardBack',e)} className="mt-1 w-full border rounded-xl p-2 text-sm"/>{form.cardBack && <img src={form.cardBack} className="mt-2 h-24 rounded border object-cover w-full"/>}</div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">Selfie with Card *</label><input type="file" accept="image/*" onChange={e=>file('selfie',e)} className="mt-1 w-full border rounded-xl p-2 text-sm"/>{form.selfie && <img src={form.selfie} className="mt-2 h-32 rounded border object-cover"/>}</div>
                    <div className="md:col-span-2 mt-4"><button onClick={submit} className="w-full h-12 rounded-full bg-[#0A2A8A] text-white font-bold">Submit ✓</button></div>
                  </div>
                ) : (
                  <div className="text-center py-10"><div className="text-2xl font-black">Application Received!</div><button onClick={()=>setTab('dashboard')} className="mt-6 h-11 px-6 rounded-full bg-black text-white">Dashboard</button></div>
                )}
              </div>
            )}

            {tab==='admin' && !adminAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto text-center"><div className="font-black">Admin Login</div><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="ADMIN2026" className="mt-4 w-full h-11 border rounded-xl px-4"/><button onClick={()=>auth('admin')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock</button></div>}
            {tab==='ceo' && !ceoAuth && <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto text-center"><div className="font-black">CEO Login</div><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="CEO2026" className="mt-4 w-full h-11 border rounded-xl px-4"/><button onClick={()=>auth('ceo')} className="mt-4 w-full h-11 rounded-full bg-black text-white">Unlock</button></div>}

            {(tab==='loans'||tab==='repayments'||tab==='defaulters'||tab==='dormant'||tab==='settings'||(tab==='admin'&&adminAuth)||(tab==='ceo'&&ceoAuth)) && (
              <div className="mt-4 bg-white border rounded-xl p-4">
                <h2 className="font-bold mb-4 capitalize">{tab} - {loans.length} records {isBoss?'(Boss)':''}</h2>
                {loans.map(l=>(
                  <div key={l.id} className="border rounded-xl p-3 mb-2 flex justify-between gap-2">
                    <div><b>{l.name}</b> • {l.region}/{l.town} • ₵{l.amountValue} • {l.status}<br/><span className="text-xs text-zinc-500">{l.id} • {l.idNumber}</span><div className="mt-2 grid grid-cols-3 gap-1">{l.cardFront&&<img src={l.cardFront} className="h-12 rounded border object-cover"/>}{l.cardBack&&<img src={l.cardBack} className="h-12 rounded border object-cover"/>}{l.selfie&&<img src={l.selfie} className="h-12 rounded border object-cover"/>}</div></div>
                    <div className="flex flex-col gap-1"><button onClick={()=>update(l.id,'Approved')} className="h-7 px-3 rounded-full bg-green-600 text-white text-xs">Approve</button><button onClick={()=>update(l.id,'Rejected')} className="h-7 px-3 rounded-full bg-red-600 text-white text-xs">Reject</button></div>
                  </div>
                ))}
                {loans.length===0 && <div className="text-center py-10 text-zinc-400">No loans yet</div>}
              </div>
            )}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfbf7]">
      <header className="h-[70px] bg-white border-b flex justify-between items-center px-6"><Logo size={42}/><button onClick={()=>setView('dashboard')} className="h-10 px-5 rounded-full bg-[#0A2A8A] text-white text-sm">Open App</button></header>
      <div className="h-1.5 grid grid-cols-3"><div className="bg-[#CE1126]"></div><div className="bg-[#FCD116]"></div><div className="bg-[#006B3F]"></div></div>
      <section className="max-w-7xl mx-auto px-6 pt-14"><h1 className="text-[56px] font-black leading-[0.9]">Credit for<br/>every<br/>Ghanaian.</h1><div className="mt-6 flex gap-3"><a href="/?boss" className="h-12 px-6 rounded-full bg-black text-white flex items-center">Boss Link /?boss</a><a href="/" className="h-12 px-6 rounded-full bg-white border flex items-center">User View</a></div></section>
    </main>
  )
}