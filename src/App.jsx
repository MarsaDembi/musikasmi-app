import { useState } from "react";
import "./App.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const AVATARS = ["🧒","🧒‍♀️","👦","🎓","👩‍🎓","🎸"];


const MATERI_LIST = [
  { id:"ritme",    icon:"🥁", color:"#f97316", title:"Irama / Ritme", sub:"Pola ketukan dalam musik" },
  { id:"tempo",    icon:"⏱️", color:"#ec4899", title:"Tempo",         sub:"Cepat lambatnya musik" },
  { id:"melodi",   icon:"🎵", color:"#eab308", title:"Melodi",        sub:"Rangkaian nada yang indah" },
  { id:"harmoni",  icon:"🎹", color:"#22c55e", title:"Harmoni",       sub:"Paduan nada yang selaras" },
  { id:"dinamika", icon:"🔊", color:"#3b82f6", title:"Dinamika",      sub:"Keras lembutnya musik" },
  { id:"notasi",   icon:"🎼", color:"#8b5cf6", title:"Notasi Musik",  sub:"Simbol penulisan musik" },
];

const MATERI_DETAIL = {
  ritme: {
    title: "Ritme",
    icon: "🥁",
    desc: "Ritme adalah pola ketukan yang teratur dalam musik. Ritme menentukan panjang pendeknya bunyi serta susunan ketukan yang membentuk alur sebuah lagu. Tanpa ritme, musik akan terdengar tidak teratur dan sulit diikuti.",
    poin: [
      "Ritme mengatur pola ketukan dalam lagu.",
      "Ritme dapat berupa ketukan cepat atau lambat.",
      "Ritme membantu pendengar mengikuti alur musik.",
      "Ritme sering ditunjukkan melalui tepukan atau alat perkusi."
    ],
    contoh: "Tepuk tangan mengikuti irama lagu anak-anak merupakan contoh sederhana ritme.",
    video: "https://www.youtube.com/embed/Yex3xVoQI20"
  },

  tempo: {
    title: "Tempo",
    icon: "⏱️",
    desc: "Tempo adalah ukuran cepat atau lambatnya sebuah lagu dimainkan. Tempo memengaruhi suasana lagu, apakah terasa tenang, semangat, sedih, atau energik.",
    poin: [
      "Tempo lambat disebut Largo atau Adagio.",
      "Tempo sedang disebut Moderato.",
      "Tempo cepat disebut Allegro atau Presto.",
      "Tempo membantu menentukan karakter lagu."
    ],
    contoh: "Lagu Nina Bobo memiliki tempo lambat, sedangkan lagu Hari Merdeka memiliki tempo cepat.",
    video: "https://www.youtube.com/embed/U55vMusyMes"
  },

  melodi: {
    title: "Melodi",
    icon: "🎵",
    desc: "Melodi adalah rangkaian nada yang tersusun secara berurutan sehingga menghasilkan sebuah lagu yang indah dan mudah diingat. Melodi menjadi bagian utama yang biasanya dinyanyikan dalam sebuah lagu.",
    poin: [
      "Melodi tersusun dari beberapa nada.",
      "Melodi memiliki tinggi rendah nada.",
      "Melodi membuat lagu mudah dikenali.",
      "Melodi dapat dimainkan oleh alat musik maupun suara manusia."
    ],
    contoh: "Nada pada lagu Balonku atau Indonesia Raya merupakan contoh melodi.",
    video: "https://www.youtube.com/embed/IfhWUKskolY"
  },

  harmoni: {
    title: "Harmoni",
    icon: "🎼",
    desc: "Harmoni adalah perpaduan beberapa nada yang dimainkan secara bersamaan sehingga menghasilkan keselarasan bunyi yang indah. Harmoni membuat musik terdengar lebih kaya dan menarik.",
    poin: [
      "Harmoni terdiri dari gabungan beberapa nada.",
      "Harmoni menciptakan keselarasan bunyi.",
      "Harmoni sering dimainkan menggunakan akor.",
      "Harmoni memperindah sebuah lagu."
    ],
    contoh: "Petikan gitar yang memainkan akor saat mengiringi penyanyi merupakan contoh harmoni.",
    video: "https://www.youtube.com/embed/u9PvIvr7FU4"
  },

  dinamika: {
    title: "Dinamika",
    icon: "🔊",
    desc: "Dinamika adalah tingkat keras dan lembutnya bunyi dalam musik. Dinamika digunakan untuk memberikan ekspresi dan perasaan sehingga lagu menjadi lebih hidup.",
    poin: [
      "Piano (p) berarti dimainkan lembut.",
      "Mezzo Forte (mf) berarti sedang.",
      "Forte (f) berarti dimainkan keras.",
      "Dinamika membuat musik lebih ekspresif."
    ],
    contoh: "Pada bagian lagu yang sedih biasanya dimainkan lebih lembut dibandingkan bagian yang penuh semangat.",
    video: "https://www.youtube.com/embed/OgvlLsQzWJQ"
  },

  notasi: {
    title: "Notasi Musik",
    icon: "📝",
    desc: "Notasi musik adalah simbol atau tanda yang digunakan untuk menuliskan nada dan irama dalam musik. Notasi membantu musisi membaca dan memainkan lagu dengan benar.",
    poin: [
      "Notasi digunakan untuk menulis musik.",
      "Terdapat notasi angka dan notasi balok.",
      "Notasi menunjukkan tinggi rendah nada.",
      "Notasi memudahkan proses belajar musik."
    ],
    contoh: "Do Re Mi Fa Sol La Si Do dalam notasi angka merupakan bentuk sederhana notasi musik.",
    video: "https://www.youtube.com/embed/uYG22GVQSjY"
  }
};

const QUIZ_QUESTIONS = [
  { q:"Apa yang dimaksud dengan irama dalam musik?", opts:["Tinggi rendahnya nada","Pola ketukan yang teratur","Keras lembutnya bunyi","Kecepatan musik"], ans:1 },
  { q:"Satuan kecepatan musik (BPM) merupakan singkatan dari...", opts:["Big Piano Music","Beats Per Minute","Bass Piano Melody","Bunyi Per Menit"], ans:1 },
  { q:"Melodi yang bergerak dari nada rendah ke tinggi disebut...", opts:["Descending","Harmoni","Ascending","Dinamika"], ans:2 },
  { q:"Istilah 'Forte' dalam dinamika musik berarti...", opts:["Sangat lembut","Lembut","Keras","Sangat keras"], ans:2 },
  { q:"Perpaduan dua atau lebih nada secara bersamaan disebut...", opts:["Melodi","Ritme","Harmoni","Tempo"], ans:2 },
  { q:"Tanda 'p' dalam notasi musik melambangkan...", opts:["Piano (lembut)","Presto (cepat)","Pentatonik","Portato"], ans:0 },
  { q:"Birama 4/4 berarti...", opts:["4 nada per bar","4 ketukan per bar","4 instrumen","4 bar per lagu"], ans:1 },
  { q:"Largo adalah istilah tempo yang berarti...", opts:["Sangat cepat","Sedang","Sangat lambat","Agak cepat"], ans:2 },
  { q:"Notasi do-re-mi-fa-sol-la-si adalah contoh dari...", opts:["Harmoni","Dinamika","Irama","Melodi"], ans:3 },
  { q:"Crescendo dalam dinamika berarti...", opts:["Berangsur lembut","Tiba-tiba keras","Berangsur keras","Tiba-tiba lembut"], ans:2 },
];
const ALAT_TRADISIONAL = [
  {
    icon: "🎋",
    name: "Angklung",
    asal: "Jawa Barat",
    unsur: "Melodi",
    bg: "#fef9c3",
    deskripsi:
      "Angklung adalah alat musik tradisional Sunda yang terbuat dari bambu dan menghasilkan nada ketika digoyangkan.",
    cara:
      "Dimainkan dengan cara menggoyangkan rangka bambu sehingga tabung bambu bergetar dan menghasilkan bunyi.",
    fungsi:
      "Digunakan sebagai alat musik melodi dalam pertunjukan seni tradisional maupun modern."
  },
  {
    icon: "🔔",
    name: "Gamelan",
    asal: "Jawa",
    unsur: "Harmoni",
    bg: "#fef3c7",
    deskripsi:
      "Gamelan merupakan seperangkat alat musik tradisional yang terdiri dari gong, saron, bonang, dan instrumen lainnya.",
    cara:
      "Dimainkan dengan dipukul menggunakan alat pemukul khusus sesuai jenis instrumennya.",
    fungsi:
      "Mengiringi pertunjukan wayang, tari tradisional, dan upacara adat."
  },
  {
    icon: "🪘",
    name: "Kendang",
    asal: "Jawa",
    unsur: "Irama",
    bg: "#fff7ed",
    deskripsi:
      "Kendang adalah alat musik pukul berbentuk tabung yang terbuat dari kayu dan kulit hewan.",
    cara:
      "Dimainkan dengan memukul kedua sisi membrannya menggunakan tangan.",
    fungsi:
      "Mengatur tempo dan irama dalam permainan gamelan maupun musik tradisional lainnya."
  },
  {
    icon: "🎵",
    name: "Sasando",
    asal: "Nusa Tenggara Timur",
    unsur: "Melodi",
    bg: "#f0fdf4",
    deskripsi:
      "Sasando adalah alat musik petik khas Pulau Rote yang memiliki resonator dari anyaman daun lontar.",
    cara:
      "Dimainkan dengan cara memetik senar menggunakan kedua tangan.",
    fungsi:
      "Menghasilkan melodi yang indah sebagai alat musik solo maupun pengiring lagu daerah."
  },
  {
    icon: "🎶",
    name: "Suling",
    asal: "Indonesia",
    unsur: "Melodi",
    bg: "#eff6ff",
    deskripsi:
      "Suling merupakan alat musik tiup tradisional yang terbuat dari bambu dengan beberapa lubang nada.",
    cara:
      "Dimainkan dengan meniup ujung suling sambil menutup dan membuka lubang nada.",
    fungsi:
      "Menghasilkan melodi lembut dalam berbagai jenis musik tradisional Indonesia."
  }
];

const ALAT_MODERN = [
  {
    icon: "🎸",
    name: "Gitar Listrik",
    asal: "Amerika Serikat",
    unsur: "Melodi",
    bg: "#fdf4ff",
    deskripsi:
      "Gitar listrik adalah alat musik petik modern yang menggunakan pickup untuk mengubah getaran senar menjadi sinyal listrik.",
    cara:
      "Dimainkan dengan memetik senar menggunakan jari atau pick dan dihubungkan ke amplifier.",
    fungsi:
      "Digunakan sebagai alat musik utama maupun pengiring dalam berbagai genre musik modern."
  },
  {
    icon: "🎹",
    name: "Piano",
    asal: "Italia",
    unsur: "Harmoni",
    bg: "#eff6ff",
    deskripsi:
      "Piano adalah alat musik papan tuts yang menghasilkan suara melalui mekanisme palu yang memukul senar.",
    cara:
      "Dimainkan dengan menekan tuts menggunakan jari tangan.",
    fungsi:
      "Menghasilkan melodi dan harmoni dalam pertunjukan solo maupun ansambel."
  },
  {
    icon: "🥁",
    name: "Drum Set",
    asal: "Amerika Serikat",
    unsur: "Irama",
    bg: "#fff1f2",
    deskripsi:
      "Drum set adalah kumpulan alat musik perkusi yang terdiri dari snare, bass drum, tom-tom, dan cymbal.",
    cara:
      "Dimainkan dengan stik drum dan pedal untuk menghasilkan berbagai pola ritme.",
    fungsi:
      "Menjadi pengatur tempo dan ritme dalam sebuah kelompok musik."
  },
  {
    icon: "🎺",
    name: "Trompet",
    asal: "Eropa",
    unsur: "Melodi",
    bg: "#fffbeb",
    deskripsi:
      "Trompet adalah alat musik tiup logam yang menghasilkan suara nyaring dan kuat.",
    cara:
      "Dimainkan dengan meniup mouthpiece sambil menekan katup nada.",
    fungsi:
      "Menghasilkan melodi utama dan memberikan aksen yang kuat dalam musik."
  },
  {
    icon: "🎻",
    name: "Biola",
    asal: "Italia",
    unsur: "Melodi",
    bg: "#f0fdf4",
    deskripsi:
      "Biola adalah alat musik gesek yang memiliki empat senar dan dikenal dengan suara yang ekspresif.",
    cara:
      "Dimainkan dengan menggesek senar menggunakan bow atau busur biola.",
    fungsi:
      "Menghasilkan melodi utama dalam musik klasik, orkestra, maupun modern."
  }
];

// ─── DATA LATIHAN KATEGORI ───────────────────────────────────────────────────
const LATIHAN_TYPES = [
  { id: "tempo",    icon: "⏱️", title: "Latihan Tempo",    sub: "Kenali cepat lambatnya musik" },
  { id: "irama",    icon: "🥁", title: "Latihan Irama",    sub: "Kenali pola ketukan musik" },
  { id: "dinamika", icon: "🔊", title: "Latihan Dinamika", sub: "Kenali keras lembutnya musik" },
  { id: "notasi",   icon: "🎼", title: "Latihan Notasi",   sub: "Kenali simbol-simbol musik" },
];

const LATIHAN_SOAL = {
  tempo: [
    { q:"Lagu dengan tempo 60 BPM termasuk kategori...", opts:["Presto","Largo","Allegro","Moderato"], ans:1 },
    { q:"Allegro berarti musik dimainkan dengan...", opts:["Sangat lambat","Lambat","Cepat","Sangat cepat"], ans:2 },
    { q:"Lagu pengantar tidur biasanya menggunakan tempo...", opts:["Presto","Allegro","Largo","Vivace"], ans:2 },
  ],
  irama: [
    { q:"Birama 2/4 berarti ada berapa ketukan per bar?", opts:["1","2","3","4"], ans:1 },
    { q:"Tanda 'istirahat' dalam irama berarti...", opts:["Bermain keras","Tidak berbunyi","Bermain cepat","Bermain lembut"], ans:1 },
    { q:"Ritme yang paling umum digunakan adalah birama...", opts:["2/4","3/4","4/4","6/8"], ans:2 },
  ],
  dinamika: [
    { q:"Simbol 'ff' (fortissimo) berarti...", opts:["Lembut","Agak keras","Sangat keras","Sedang"], ans:2 },
    { q:"Decrescendo berarti musik...", opts:["Bertambah keras","Bertambah lembut","Tetap keras","Tetap lembut"], ans:1 },
    { q:"'mp' dalam dinamika adalah singkatan dari...", opts:["Molto piano","Mezzo piano","Molto presto","Mezzo presto"], ans:1 },
  ],
  notasi: [
    { q:"Not 'do' dalam angka dilambangkan dengan...", opts:["2","3","1","4"], ans:2 },
    { q:"Tanda kunci treble (sol) digunakan untuk...", opts:["Nada bass","Nada tinggi","Nada sedang","Nada perkusi"], ans:1 },
    { q:"Berapa nada dalam satu oktaf?", opts:["5","6","7","8"], ans:3 },
  ],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const useStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch (err) { console.error("Storage error:", err); }
  // ignore localStorage error
};
  return [val, set];
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Header({ title, sub, onBack, right }) {
  return (
    <div style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",padding:"1rem 1.25rem",display:"flex",alignItems:"center",gap:"0.75rem",color:"#fff"}}>
      {onBack && (
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
      )}
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:"1.05rem"}}>{title}</div>
        <div style={{fontSize:"0.78rem",opacity:0.85}}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id:"home",    icon:"🏠", label:"Beranda" },
    { id:"materi",  icon:"📚", label:"Materi" },
    { id:"latihan", icon:"✏️", label:"Latihan" },
    { id:"profil",  icon:"👤", label:"Profil" },
  ];
  return (
    <div style={{position:"sticky",bottom:0,background:"#fff",borderTop:"1px solid #f0e8ff",display:"flex",zIndex:50}}>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)}
          style={{flex:1,padding:"0.6rem 0",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,
            color: tab===it.id ? "#7c3aed" : "#aaa", fontSize:"0.68rem",fontWeight: tab===it.id ? 700 : 400}}>
          <span style={{fontSize:"1.3rem"}}>{it.icon}</span>
          {it.label}
        </button>
      ))}
    </div>
  );
}

// LOGIN SCREEN
// LOGIN SCREEN
function LoginScreen({ onLogin, savedProfiles }) { // <-- Ditambahkan savedProfiles ke dalam props
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(0);
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#f3e8ff 0%,#fce7f3 50%,#fff7ed 100%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"2.5rem 1.25rem"}}>
      <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>🎵</div>
      <div style={{fontFamily:"system-ui",fontSize:"1.8rem",fontWeight:900,background:"linear-gradient(90deg,#7c3aed,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"0.05em",marginBottom:"0.25rem"}}>MUSIKAMI</div>
      <div style={{color:"#888",fontSize:"0.85rem",marginBottom:"2rem"}}>Audio • Multimedia • Interactive</div>

      <div style={{background:"#fff",borderRadius:20,padding:"1.5rem",width:"100%",maxWidth:420,boxShadow:"0 4px 24px rgba(124,58,237,0.08)"}}>
        <h2 style={{textAlign:"center",marginBottom:"1.25rem",fontWeight:700,fontSize:"1.1rem"}}>Selamat Datang di MUSIKAMI!</h2>
        <label style={{fontSize:"0.85rem",color:"#555",display:"block",marginBottom:"0.4rem"}}>Siapa namamu?</label>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder="Ketik namamu di sini..."
          style={{width:"100%",padding:"0.75rem 1rem",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:"0.95rem",outline:"none",marginBottom:"1rem",boxSizing:"border-box"}} />

        <div style={{fontSize:"0.85rem",color:"#555",marginBottom:"0.6rem"}}>Pilih avatarmu!</div>
        <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap",marginBottom:"1.25rem"}}>
          {AVATARS.map((a,i) => (
            <button key={i} onClick={()=>setAvatar(i)}
              style={{fontSize:"2rem",padding:"0.4rem",borderRadius:12,border: avatar===i ? "2.5px solid #7c3aed" : "2px solid transparent",background: avatar===i ? "#f3e8ff" : "#f9fafb",cursor:"pointer",transition:"all 0.15s"}}>
              {a}
            </button>
          ))}
        </div>

        <button onClick={()=>{if(name.trim()) onLogin(name.trim(), avatar)}}
          disabled={!name.trim()}
          style={{width:"100%",padding:"1rem",borderRadius:14,border:"none",background:"linear-gradient(90deg,#7c3aed,#ec4899)",color:"#fff",fontWeight:700,fontSize:"1rem",cursor:name.trim()?"pointer":"not-allowed",opacity:name.trim()?1:0.6,transition:"opacity 0.2s"}}>
          Mulai Belajar! 🚀
        </button>

        {/* Menggunakan state dinamis 'savedProfiles' (huruf kecil) menggantikan konstanta statis lama */}
        {savedProfiles && savedProfiles.length > 0 && (
          <>
            <div style={{textAlign:"center",color:"#aaa",fontSize:"0.8rem",margin:"1rem 0 0.6rem"}}>Atau pilih profil yang ada:</div>
            <div style={{maxHeight:140,overflowY:"auto",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {savedProfiles.map((p,i) => (
                <button key={i} onClick={()=>onLogin(p.name, AVATARS.indexOf(p.avatar) >= 0 ? AVATARS.indexOf(p.avatar) : 1, p)}
                  style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.6rem 0.75rem",borderRadius:12,border:"1px solid #f0e8ff",background:"#faf5ff",cursor:"pointer",width:"100%",textAlign:"left"}}>
                  <span style={{fontSize:"1.5rem"}}>{p.avatar}</span>
                  <span style={{fontWeight:500,fontSize:"0.9rem"}}>{p.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// HOME
function Home({ user, setTab,  onOpenEksplorasi, onOpenKuis, onOpenAlatMusik }) {
  const progress = Math.round((user.progress / MATERI_LIST.length) * 100);
  return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <div style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",padding:"1rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <span style={{fontSize:"1.4rem"}}>🎵</span>
          <div>
            <div style={{fontWeight:800,fontSize:"1rem"}}>MUSIKA</div>
            <div style={{fontSize:"0.7rem",opacity:0.85}}>Musik Interaktif MI</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:999,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>🎵</div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:999,padding:"0.3rem 0.85rem",display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.88rem",fontWeight:600}}>
            <span style={{fontSize:"1.2rem"}}>{AVATARS[user.avatarIdx]}</span>{user.name}
          </div>
        </div>
      </div>

      <div style={{background:"#fff",padding:"0.6rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.8rem",borderBottom:"1px solid #f0e8ff"}}>
        <span style={{color:"#555"}}>Progres Belajar</span>
        <span style={{color:"#7c3aed",fontWeight:600}}>{progress}%</span>
      </div>
      <div style={{height:6,background:"#f0e8ff"}}>
        <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#7c3aed,#ec4899)",borderRadius:3,transition:"width 0.5s"}} />
      </div>

      <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        <div style={{background:"#fff",borderRadius:16,padding:"1rem 1.25rem",display:"flex",alignItems:"center",gap:"1rem",boxShadow:"0 2px 12px rgba(124,58,237,0.06)"}}>
          <span style={{fontSize:"2rem"}}>🎶</span>
          <div>
            <div style={{fontWeight:700,fontSize:"1rem"}}>Halo, {user.name}! 👋</div>
            <div style={{color:"#888",fontSize:"0.82rem"}}>Ayo belajar unsur-unsur musik hari ini!</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
          {[
            { icon:"📚", title:"Materi", sub:"Pelajari unsur musik", action:()=>setTab("materi") },
            { icon:"🎧", title:"Eksplorasi", sub:"Dengarkan & rasakan", action:onOpenEksplorasi },
            { icon:"✏️", title:"Latihan", sub:"Uji pemahamanmu", action:()=>setTab("latihan") },
            { icon:"🏆", title:"Kuis", sub:"Evaluasi belajar", action:onOpenKuis },
          ].map((c,i) => (
            <button key={i} onClick={c.action}
              style={{background:"#fff",border:"1px solid #f0e8ff",borderRadius:16,padding:"1.1rem",textAlign:"left",cursor:"pointer",transition:"transform 0.15s,box-shadow 0.15s",boxShadow:"0 2px 8px rgba(124,58,237,0.04)"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>{c.icon}</div>
              <div style={{fontWeight:700,fontSize:"0.9rem"}}>{c.title}</div>
              <div style={{color:"#aaa",fontSize:"0.75rem"}}>{c.sub}</div>
            </button>
          ))}
        </div>

        <button onClick={onOpenAlatMusik}
          style={{background:"#fff",border:"1px solid #f0e8ff",borderRadius:16,padding:"1rem 1.25rem",display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer",width:"100%",textAlign:"left",boxShadow:"0 2px 8px rgba(124,58,237,0.04)"}}>
          <span style={{fontSize:"1.8rem"}}>🎸</span>
          <div>
            <div style={{fontWeight:700,fontSize:"0.9rem"}}>Alat Musik</div>
            <div style={{color:"#aaa",fontSize:"0.75rem"}}>Kenali berbagai alat musik tradisional & modern</div>
          </div>
        </button>

        <div style={{background:"#fff",borderRadius:16,padding:"1rem",boxShadow:"0 2px 8px rgba(124,58,237,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:700,marginBottom:"0.75rem"}}>
            <span>📊</span> Aktivitas Terakhir
          </div>
          {user.progress === 0 ? (
            <div style={{color:"#bbb",fontSize:"0.82rem",textAlign:"center",padding:"1rem 0"}}>Belum ada aktivitas. Ayo mulai belajar!</div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
              {MATERI_LIST.slice(0, user.progress).map((m,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",fontSize:"0.82rem",padding:"0.4rem 0",borderBottom:"1px solid #faf5ff"}}>
                  <span>{m.icon}</span><span style={{flex:1}}>{m.title}</span>
                  <span style={{color:"#22c55e",fontSize:"0.75rem",fontWeight:600}}>✓ Selesai</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// MATERI LIST
function MateriPage({ user, onOpenDetail }) {
  return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <Header title="Materi Unsur Musik" sub="Pilih materi untuk dipelajari" />
      <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.6rem"}}>
        {MATERI_LIST.map((m,i) => {
          const done = i < user.progress;
          return (
            <button key={m.id} onClick={()=>onOpenDetail(m.id)}
              style={{background:"#fff",border:"none",borderRadius:14,padding:"1rem",display:"flex",alignItems:"center",gap:"1rem",cursor:"pointer",textAlign:"left",borderLeft:`4px solid ${m.color}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",width:"100%"}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${m.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>{m.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:"0.92rem"}}>{i+1}. {m.title}</div>
                <div style={{color:"#999",fontSize:"0.78rem"}}>{m.sub}</div>
              </div>
              <span style={{color: done ? "#22c55e" : "#ddd",fontSize:"1.1rem"}}>✓</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// MATERI DETAIL
function MateriDetail({ id, user, setUser, onBack }) {
  const m = MATERI_LIST.find(x => x.id === id);
  const d = MATERI_DETAIL[id];
  const idx = MATERI_LIST.findIndex(x => x.id === id);
  const done = idx < user.progress;

  const markDone = () => {
    if (!done) {
      const newProgress = Math.max(user.progress, idx + 1);
      setUser({ ...user, progress: newProgress });
    }
    onBack();
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title={d.title} sub={m.sub} onBack={onBack} />

      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "1.25rem",
            boxShadow: "0 2px 10px rgba(124,58,237,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            {d.icon}
          </div>

          <p
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.92rem",
            }}
          >
            {d.desc}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "1.25rem",
            boxShadow: "0 2px 10px rgba(124,58,237,0.06)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            📌 Poin Penting:
          </div>

          {d.poin.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.6rem",
                marginBottom: "0.5rem",
                fontSize: "0.88rem",
                color: "#555",
              }}
            >
              <span
                style={{
                  color: "#7c3aed",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                •
              </span>
              {p}
            </div>
          ))}
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg,#f3e8ff,#fce7f3)",
            borderRadius: 16,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            💡 Contoh:
          </div>

          <p
            style={{
              color: "#555",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            {d.contoh}
          </p>
        </div>

        {/* VIDEO PEMBELAJARAN */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "1rem",
            boxShadow: "0 2px 10px rgba(124,58,237,0.06)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            🎥 Video Pembelajaran
          </div>

          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              borderRadius: 12,
            }}
          >
            <iframe
              src={d.video}
              title={d.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 12,
              }}
            />
          </div>
        </div>

        <button
          onClick={markDone}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: 14,
            border: "none",
            background: done
              ? "#22c55e"
              : "linear-gradient(90deg,#7c3aed,#ec4899)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          {done
            ? "✓ Sudah Dipelajari"
            : "✅ Tandai Selesai & Kembali"}
        </button>
      </div>
    </div>
  );
}

// EKSPLORASI
function EksplorasiPage({ onBack }) {
  const [active, setActive] = useState(null);

  const playSound = (freq, duration = 300, volume = 0.3) => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = freq;

    gainNode.gain.value = volume;

    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      audioCtx.close();
    }, duration);
  };

  const playTempo = (type) => {
    let interval;

    if (type === "lambat") interval = 1000;
    if (type === "sedang") interval = 600;
    if (type === "cepat") interval = 300;

    let count = 0;

    const timer = setInterval(() => {
      playSound(600, 120);

      count++;

      if (count >= 4) {
        clearInterval(timer);
      }
    }, interval);
  };

  const playIrama = (beat) => {
    let count = 0;

    const timer = setInterval(() => {
      if (count === 0) {
        playSound(800, 150);
      } else {
        playSound(500, 100);
      }

      count++;

      if (count >= beat) {
        clearInterval(timer);
      }
    }, 500);
  };

  const playDinamika = (level) => {
    if (level === "piano") {
      playSound(500, 500, 0.1);
    }

    if (level === "mezzo") {
      playSound(500, 500, 0.3);
    }

    if (level === "forte") {
      playSound(500, 500, 0.7);
    }
  };

  const tempoData = [
    {
      icon: "🐢",
      label: "Lambat",
      sub: "Largo",
      bg: "#eff6ff",
      col: "#3b82f6",
      sound: () => playTempo("lambat"),
    },
    {
      icon: "🚶",
      label: "Sedang",
      sub: "Moderato",
      bg: "#f0fdf4",
      col: "#22c55e",
      sound: () => playTempo("sedang"),
    },
    {
      icon: "🐇",
      label: "Cepat",
      sub: "Allegro",
      bg: "#fff1f2",
      col: "#f43f5e",
      sound: () => playTempo("cepat"),
    },
  ];

  const iramaData = [
    {
      icon: "👏👏",
      label: "Birama 2/4",
      sub: "Dua ketukan",
      bg: "#f3e8ff",
      col: "#7c3aed",
      sound: () => playIrama(2),
    },
    {
      icon: "👏👏👏",
      label: "Birama 3/4",
      sub: "Tiga ketukan",
      bg: "#fce7f3",
      col: "#ec4899",
      sound: () => playIrama(3),
    },
    {
      icon: "👏👏👏👏",
      label: "Birama 4/4",
      sub: "Empat ketukan",
      bg: "#fff7ed",
      col: "#f97316",
      sound: () => playIrama(4),
    },
  ];

  const dinamikaData = [
    {
      icon: "🔇",
      label: "Piano",
      sub: "Lembut (p)",
      bg: "#eff6ff",
      col: "#3b82f6",
      sound: () => playDinamika("piano"),
    },
    {
      icon: "🔉",
      label: "Mezzo",
      sub: "Sedang (mp/mf)",
      bg: "#f0fdf4",
      col: "#22c55e",
      sound: () => playDinamika("mezzo"),
    },
    {
      icon: "🔊",
      label: "Forte",
      sub: "Keras (f)",
      bg: "#fff1f2",
      col: "#f43f5e",
      sound: () => playDinamika("forte"),
    },
  ];

 return (
  <div
    style={{
      flex: 1,
      overflowY: "auto",
      background: "linear-gradient(180deg,#faf5ff,#ffffff)",
    }}
  >
    <Header
      title="Eksplorasi Bunyi 🎧"
      sub="Dengarkan dan rasakan musik"
      onBack={onBack}
    />

    <div
      style={{
        margin: "1rem",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: 18,
        padding: "1rem",
        fontSize: "0.85rem",
        color: "#92400e",
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      💡 <strong>Tips:</strong> Tekan kartu di bawah untuk mendengarkan
      contoh bunyi dan memahami unsur musik.
    </div>

    <div
      style={{
        padding: "0 1rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* TEMPO */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "1.2rem",
          boxShadow: "0 10px 25px rgba(124,58,237,.08)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            color: "#7c3aed",
          }}
        >
          ⏱️ Eksplorasi Tempo
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.75rem",
          }}
        >
          {tempoData.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(t.label);
                t.sound();
              }}
              style={{
                border: "none",
                borderRadius: 20,
                padding: "1rem",
                background: t.bg,
                cursor: "pointer",
                boxShadow: "0 6px 15px rgba(0,0,0,.08)",
                transition: "0.3s",
              }}
            >
              <div style={{ fontSize: "2rem" }}>{t.icon}</div>

              <div
                style={{
                  fontWeight: 700,
                  color: t.col,
                  marginTop: "0.4rem",
                }}
              >
                {t.label}
              </div>

              <small>{t.sub}</small>
            </button>
          ))}
        </div>
      </div>

      {/* IRAMA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "1.2rem",
          boxShadow: "0 10px 25px rgba(124,58,237,.08)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            color: "#7c3aed",
          }}
        >
          🥁 Eksplorasi Irama
        </h3>

        {iramaData.map((r, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(r.label);
              r.sound();
            }}
            style={{
              width: "100%",
              marginBottom: "0.75rem",
              border: "none",
              borderRadius: 18,
              padding: "1rem",
              background: r.bg,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontWeight: 700,
                  color: r.col,
                }}
              >
                {r.label}
              </div>

              <small>{r.sub}</small>
            </div>

            <div style={{ fontSize: "1.5rem" }}>
              {r.icon}
            </div>
          </button>
        ))}
      </div>

      {/* DINAMIKA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "1.2rem",
          boxShadow: "0 10px 25px rgba(124,58,237,.08)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            color: "#7c3aed",
          }}
        >
          🔊 Eksplorasi Dinamika
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.75rem",
          }}
        >
          {dinamikaData.map((d, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(d.label);
                d.sound();
              }}
              style={{
                border: "none",
                borderRadius: 20,
                padding: "1rem",
                background: d.bg,
                cursor: "pointer",
                boxShadow: "0 6px 15px rgba(0,0,0,.08)",
              }}
            >
              <div style={{ fontSize: "2rem" }}>
                {d.icon}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  color: d.col,
                  marginTop: "0.4rem",
                }}
              >
                {d.label}
              </div>

              <small>{d.sub}</small>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          style={{
            background:
              "linear-gradient(135deg,#7c3aed,#ec4899)",
            borderRadius: 24,
            padding: "1.5rem",
            color: "#fff",
            textAlign: "center",
            boxShadow:
              "0 10px 30px rgba(124,58,237,.3)",
          }}
        >
          <div style={{ fontSize: "2.5rem" }}>🎧</div>

          <div
            style={{
              fontWeight: 700,
              marginTop: "0.5rem",
            }}
          >
            Sedang Memutar
          </div>

          <div
            style={{
              fontSize: "1.3rem",
              marginTop: "0.3rem",
            }}
          >
            {active}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

// ─── COMPONENT: LATIHAN MENU PAGE ────────────────────────────────────────────
// Disesuaikan menerima 'onSelectLatihan' sesuai logika tab baru kamu
function LatihanPage({ onSelectLatihan }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title="Latihan Musik" sub="Uji kemampuanmu per kategori materi" />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {LATIHAN_TYPES.map((l) => (
          <button key={l.id} onClick={() => onSelectLatihan(l.id)}
            style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", width: "100%" }}>
            <span style={{ fontSize: "2rem" }}>{l.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#333" }}>{l.title}</div>
              <div style={{ color: "#aaa", fontSize: "0.78rem" }}>{l.sub}</div>
            </div>
            <span style={{ color: "#7c3aed", fontWeight: "bold" }}>Mulai ›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── COMPONENT: SUB-HALAMAN DETAIL LATIHAN SOAL ──────────────────────────────
// Disesuaikan menggunakan parameter 'type' sebagai ID kategori soal
function LatihanSoal({ type, onBack }) {
  const soalList = LATIHAN_SOAL[type] || [];
  const typeInfo = LATIHAN_TYPES.find(t => t.id === type);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (optIdx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    if (optIdx === soalList[currentIdx].ans) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOpt(null);
    if (currentIdx + 1 < soalList.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div style={{ flex: 1, background: "#faf5ff", padding: "2rem 1.25rem", textAlign: "center" }}>
        <span style={{ fontSize: "4rem" }}>🎉</span>
        <h2>Latihan Selesai!</h2>
        <p style={{ color: "#666" }}>Kamu telah menyelesaikan {typeInfo?.title}</p>
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 16, margin: "1.5rem 0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.9rem", color: "#888" }}>Skor Kamu</div>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#7c3aed" }}>{Math.round((score / soalList.length) * 100)}</div>
          <div style={{ fontSize: "0.85rem", color: "#555" }}>Menjawab benar {score} dari {soalList.length} soal</div>
        </div>
        <button onClick={onBack} style={{ width: "100%", padding: "1rem", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Kembali Menu Latihan</button>
      </div>
    );
  }

  const currentSoal = soalList[currentIdx];

  return (
    <div style={{ flex: 1, background: "#faf5ff", display: "flex", flexDirection: "column" }}>
      <Header title={typeInfo?.title || "Latihan"} sub={`Pertanyaan ${currentIdx + 1} dari ${soalList.length}`} onBack={onBack} />
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", fontWeight: 600, fontSize: "1rem", color: "#333", lineHeight: 1.5 }}>
          {currentSoal?.q}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {currentSoal?.opts.map((opt, idx) => {
            let btnBg = "#fff";
            let btnBorder = "1px solid #e5e7eb";
            if (selectedOpt !== null) {
              if (idx === currentSoal.ans) {
                btnBg = "#dcfce7"; btnBorder = "1.5px solid #22c55e";
              } else if (idx === selectedOpt) {
                btnBg = "#fee2e2"; btnBorder = "1.5px solid #ef4444";
              }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedOpt !== null}
                style={{ background: btnBg, border: btnBorder, padding: "1rem", borderRadius: 12, textAlign: "left", cursor: selectedOpt !== null ? "default" : "pointer", fontSize: "0.9rem", fontWeight: 500, width: "100%" }}>
                {opt}
              </button>
            );
          })}
        </div>
        {selectedOpt !== null && (
          <button onClick={nextQuestion} style={{ marginTop: "auto", width: "100%", padding: "1rem", borderRadius: 14, border: "none", background: "#7c3aed", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {currentIdx + 1 === soalList.length ? "Lihat Hasil 📊" : "Pertanyaan Selanjutnya ›"}
          </button>
        )}
      </div>
    </div>
  );
}

// KUIS
function KuisIntro({ user, setUser, onBack }) {
  const [started, setStarted] = useState(false);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const confirm = () => {
    if (sel === null) return;
    const correct = sel === QUIZ_QUESTIONS[cur].ans;
    const ns = correct ? score + 10 : score;
    if (cur + 1 < QUIZ_QUESTIONS.length) { setCur(c=>c+1); setSel(null); setScore(ns); }
    else {
      setScore(ns);
      setDone(true);
      if (ns > user.quizBest) setUser({...user, quizBest: ns});
    }
  };

  if (!started) return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <Header title="Kuis Evaluasi 🏆" sub="Soal 1 dari 10" onBack={onBack}
        right={<div style={{textAlign:"right"}}><div style={{fontSize:"0.68rem",opacity:0.8}}>Skor</div><div style={{fontWeight:700}}>0</div></div>} />
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"2.5rem 1.25rem",gap:"1rem",textAlign:"center"}}>
        <div style={{fontSize:"4rem"}}>🏆</div>
        <div style={{fontWeight:800,fontSize:"1.3rem"}}>Kuis Evaluasi</div>
        <div style={{color:"#888",fontSize:"0.85rem"}}>Uji pemahamanmu tentang unsur-unsur musik!</div>
        <div style={{background:"#fff",borderRadius:16,padding:"1.25rem",width:"100%",textAlign:"left",boxShadow:"0 2px 10px rgba(124,58,237,0.06)"}}>
          <div style={{fontWeight:700,marginBottom:"0.75rem"}}>📋 Petunjuk:</div>
          {["Kuis terdiri dari 10 soal pilihan ganda","Pilih jawaban yang paling tepat","Setiap jawaban benar mendapat 10 poin","Tidak ada pengurangan nilai untuk jawaban salah"].map((p,i)=>(
            <div key={i} style={{fontSize:"0.85rem",color:"#555",marginBottom:"0.4rem"}}>• {p}</div>
          ))}
        </div>
        <button onClick={()=>setStarted(true)}
          style={{padding:"1rem 3rem",borderRadius:14,border:"none",background:"linear-gradient(90deg,#f97316,#eab308)",color:"#fff",fontWeight:700,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(249,115,22,0.3)"}}>
          Mulai Kuis! 🎯
        </button>
      </div>
    </div>
  );

  if (done) return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <Header title="Kuis Evaluasi 🏆" sub="Hasil Kuis" onBack={onBack} />
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"3rem 1.5rem",gap:"1rem",textAlign:"center"}}>
        <div style={{fontSize:"4rem"}}>{score>=80?"🏆":score>=60?"🎉":"💪"}</div>
        <div style={{fontWeight:800,fontSize:"1.8rem",color:"#7c3aed"}}>{score}/100</div>
        <div style={{fontWeight:600,fontSize:"1rem"}}>{score>=80?"Luar Biasa!":score>=60?"Bagus Sekali!":"Ayo Belajar Lagi!"}</div>
        <div style={{color:"#888",fontSize:"0.85rem"}}>{score>=80?"Kamu menguasai materi musik dengan sangat baik!":score>=60?"Kamu sudah paham banyak hal. Terus semangat!":"Pelajari lagi materinya ya, kamu pasti bisa!"}</div>
        <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>{setCur(0);setSel(null);setScore(0);setDone(false);setStarted(true)}}
            style={{padding:"0.9rem 1.5rem",borderRadius:12,border:"none",background:"linear-gradient(90deg,#7c3aed,#ec4899)",color:"#fff",fontWeight:700,cursor:"pointer"}}>Ulangi Kuis</button>
          <button onClick={onBack}
            style={{padding:"0.9rem 1.5rem",borderRadius:12,border:"2px solid #7c3aed",background:"#fff",color:"#7c3aed",fontWeight:700,cursor:"pointer"}}>Kembali</button>
        </div>
      </div>
    </div>
  );

  const q = QUIZ_QUESTIONS[cur];
  return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <Header title="Kuis Evaluasi 🏆" sub={`Soal ${cur+1} dari ${QUIZ_QUESTIONS.length}`} onBack={onBack}
        right={<div style={{textAlign:"right"}}><div style={{fontSize:"0.68rem",opacity:0.8}}>Skor</div><div style={{fontWeight:700}}>{score}</div></div>} />
      <div style={{height:5,background:"#f0e8ff"}}>
        <div style={{height:"100%",width:`${((cur)/QUIZ_QUESTIONS.length)*100}%`,background:"linear-gradient(90deg,#7c3aed,#ec4899)",transition:"width 0.3s"}} />
      </div>
      <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        <div style={{background:"#fff",borderRadius:16,padding:"1.25rem",fontWeight:600,fontSize:"0.95rem",lineHeight:1.6,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          {cur+1}. {q.q}
        </div>
        {q.opts.map((o,i) => (
          <button key={i} onClick={()=>setSel(i)}
            style={{background: sel===i ? "#f3e8ff" : "#fff",border:`2px solid ${sel===i ? "#7c3aed" : "#f0e8ff"}`,borderRadius:14,padding:"0.9rem 1rem",textAlign:"left",cursor:"pointer",fontSize:"0.9rem",fontWeight: sel===i ? 600 : 400,color: sel===i ? "#7c3aed" : "#333",transition:"all 0.15s"}}>
            {String.fromCharCode(65+i)}. {o}
          </button>
        ))}
        <button onClick={confirm} disabled={sel===null}
          style={{padding:"1rem",borderRadius:14,border:"none",background: sel!==null ? "linear-gradient(90deg,#7c3aed,#ec4899)" : "#e5e7eb",color: sel!==null ? "#fff" : "#aaa",fontWeight:700,fontSize:"0.95rem",cursor: sel!==null ? "pointer" : "not-allowed"}}>
          {cur+1<QUIZ_QUESTIONS.length ? "Konfirmasi Jawaban →" : "Lihat Hasil 🏆"}
        </button>
      </div>
    </div>
  );
}

// ALAT MUSIK
function AlatMusikPage({ onBack }) {
  const [tab, setTab] = useState("tradisional");
  const [selected, setSelected] = useState(null);

  const list =
    tab === "tradisional"
      ? ALAT_TRADISIONAL
      : ALAT_MODERN;

  const isDesktop = window.innerWidth > 768;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#faf5ff",
      }}
    >
      <Header
        title="Alat Musik 🎸"
        sub="Kenali berbagai alat musik"
        onBack={onBack}
      />

      {/* TAB */}
      <div
        style={{
          display: "flex",
          margin: "0.75rem",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {["tradisional", "modern"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "0.8rem",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              background:
                tab === t
                  ? "linear-gradient(90deg,#f97316,#eab308)"
                  : "#fff",
              color: tab === t ? "#fff" : "#888",
            }}
          >
            {t === "tradisional"
              ? "🎎 Tradisional"
              : "🎹 Modern"}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div
        style={{
          padding: "0 0.75rem 1rem",
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "repeat(4,1fr)"
            : "repeat(2,1fr)",
          gap: "0.75rem",
        }}
      >
        {list.map((a, i) => (
          <div
            key={i}
            onClick={() => setSelected(a)}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "1rem",
              border: "1px solid #f0e8ff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                textAlign: "center",
                marginBottom: "0.5rem",
              }}
            >
              {a.icon}
            </div>

            <div
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                textAlign: "center",
              }}
            >
              {a.name}
            </div>

            <div
              style={{
                color: "#888",
                fontSize: "0.78rem",
                textAlign: "center",
                margin: "0.25rem 0 0.5rem",
              }}
            >
              📍 {a.asal}
            </div>

            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  background: "#f3e8ff",
                  color: "#7c3aed",
                  fontSize: "0.7rem",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                {a.unsur}
              </span>
            </div>

            {/* DESKRIPSI SINGKAT */}
            <div
              style={{
                marginTop: "0.8rem",
                fontSize: "0.75rem",
                color: "#555",
                lineHeight: 1.5,
                textAlign: "justify",
              }}
            >
              {a.deskripsi}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(a);
              }}
              style={{
                width: "100%",
                marginTop: "0.8rem",
                border: "none",
                padding: "10px",
                borderRadius: 10,
                background:
                  "linear-gradient(90deg,#7c3aed,#a855f7)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DETAIL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: 20,
              padding: "1.5rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "5rem" }}>
                {selected.icon}
              </div>

              <h2
                style={{
                  color: "#7c3aed",
                  marginBottom: "0.5rem",
                }}
              >
                {selected.name}
              </h2>

              <div
                style={{
                  color: "#666",
                  marginBottom: "0.75rem",
                }}
              >
                📍 {selected.asal}
              </div>

              <span
                style={{
                  background: "#ede9fe",
                  color: "#7c3aed",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                {selected.unsur}
              </span>
            </div>

            <div
              style={{
                marginTop: "1rem",
                background: "#faf5ff",
                padding: "1rem",
                borderRadius: 12,
              }}
            >
              <h4>📖 Deskripsi</h4>
              <p>{selected.deskripsi}</p>
            </div>

            <div
              style={{
                marginTop: "1rem",
                background: "#fefce8",
                padding: "1rem",
                borderRadius: 12,
              }}
            >
              <h4>🎵 Cara Memainkan</h4>
              <p>{selected.cara}</p>
            </div>

            <div
              style={{
                marginTop: "1rem",
                background: "#ecfdf5",
                padding: "1rem",
                borderRadius: 12,
              }}
            >
              <h4>⭐ Fungsi</h4>
              <p>{selected.fungsi}</p>
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{
                width: "100%",
                marginTop: "1rem",
                border: "none",
                padding: "12px",
                borderRadius: 12,
                background:
                  "linear-gradient(90deg,#7c3aed,#a855f7)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// PROFIL
function ProfilPage({ user, onLogout, onBack }) {
  const progress = (user.progress / MATERI_LIST.length) * 100;
  return (
    <div style={{flex:1,overflowY:"auto",background:"#faf5ff"}}>
      <Header title="Profil Siswa 👤" sub="Lihat progres belajarmu" onBack={onBack} />
      <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        <div style={{background:"#fff",borderRadius:16,padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 10px rgba(124,58,237,0.06)"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"0.5rem"}}>{AVATARS[user.avatarIdx]}</div>
          <div style={{fontWeight:700,fontSize:"1.15rem"}}>{user.name}</div>
          <div style={{color:"#888",fontSize:"0.82rem"}}>Pelajar Musik Asyik 🎵</div>
        </div>

        <div style={{background:"#fff",borderRadius:16,padding:"1.25rem",boxShadow:"0 2px 10px rgba(124,58,237,0.06)"}}>
          <div style={{fontWeight:700,marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>📊 Ringkasan Progres</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
            <div style={{background:"#f3e8ff",borderRadius:12,padding:"1rem",textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:"1.6rem",color:"#7c3aed"}}>{user.progress}</div>
              <div style={{fontSize:"0.75rem",color:"#888"}}>Materi Selesai</div>
            </div>
            <div style={{background:"#fffbeb",borderRadius:12,padding:"1rem",textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:"1.6rem",color:"#f97316"}}>{user.quizBest}</div>
              <div style={{fontSize:"0.75rem",color:"#888"}}>Nilai Kuis Tertinggi</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",marginBottom:"0.4rem"}}>
            <span style={{color:"#555"}}>Progres Materi</span>
            <span style={{color:"#7c3aed",fontWeight:600}}>{user.progress}/{MATERI_LIST.length}</span>
          </div>
          <div style={{height:8,background:"#f0e8ff",borderRadius:999}}>
            <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#7c3aed,#ec4899)",borderRadius:999,transition:"width 0.5s"}} />
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:16,padding:"1.25rem",boxShadow:"0 2px 10px rgba(124,58,237,0.06)"}}>
          <div style={{fontWeight:700,marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>📚 Status Materi</div>
          {MATERI_LIST.map((m,i) => {
            const done = i < user.progress;
            return (
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.6rem 0",borderBottom:"1px solid #faf5ff"}}>
                <span style={{fontSize:"1.2rem"}}>{m.icon}</span>
                <span style={{flex:1,fontSize:"0.88rem"}}>{m.title}</span>
                <span style={{color: done ? "#22c55e" : "#ddd",fontSize:"1rem"}}>{done ? "✓" : "○"}</span>
              </div>
            );
          })}
        </div>

        <button onClick={onLogout}
          style={{padding:"0.9rem",borderRadius:14,border:"2px solid #fecaca",background:"#fff5f5",color:"#ef4444",fontWeight:600,fontSize:"0.9rem",cursor:"pointer"}}>
          🚪 Keluar / Ganti Profil
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  // 1. State untuk menyimpan daftar profil secara permanen di LocalStorage
  const [savedProfiles, setSavedProfiles] = useStorage("saved_profiles", [
    { name: "Thifal Zain", avatar: "🧒", avatarIdx: 0, progress: 3, quizBest: 70 },
    { name: "Midah",       avatar: "🧒‍♀️", avatarIdx: 1, progress: 0, quizBest: 0 },
  ]);

  // 2. State user aktif, navigasi, dan melacak sub-konten
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); 
  const [tab, setTab] = useState("home");        
  const [materiActiveId, setMateriActiveId] = useState(null); 
  const [latihanActiveId, setLatihanActiveId] = useState(null);
 // Melacak jenis latihan aktif

  
  // 3. Logika Login & Simpan otomatis ke daftar profil
  const handleLogin = (name, avatarIdx, existingProfile = null) => {
    if (existingProfile) {
      setUser(existingProfile);
    } else {
      const newProfile = {
        name: name,
        avatar: AVATARS[avatarIdx],
        avatarIdx: avatarIdx,
        progress: 0,
        quizBest: 0
      };
      setUser(newProfile);

      const isExist = savedProfiles.some(p => p.name.toLowerCase() === name.toLowerCase());
      if (!isExist) {
        setSavedProfiles([...savedProfiles, newProfile]);
      }
    }
    setScreen("main");
    setTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  // ─── RENDERING SCREEN ───────────────────────────────────────────────────────
  
  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} savedProfiles={savedProfiles} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}>
      
      {/* ─── TAB: HOME ─── */}
      {tab === "home" && (
        <Home 
          user={user} 
          setTab={setTab} 
          onOpenEksplorasi={() => setTab("eksplorasi")} 
          onOpenKuis={() => setTab("kuis")} 
          onOpenAlatMusik={() => setTab("alatmusik")} 
        />
      )}

      {/* ─── TAB: MATERI ─── */}
      {tab === "materi" && (
        materiActiveId ? (
          <MateriDetail 
            id={materiActiveId} 
            user={user} 
            setUser={setUser} 
            onBack={() => setMateriActiveId(null)} 
          />
        ) : (
          <MateriPage 
            user={user} 
            onOpenDetail={(id) => setMateriActiveId(id)} 
          />
        )
      )}

      {/* ─── TAB: LATIHAN (Memanggil LatihanPage & LatihanSoal) ─── */}
      {tab === "latihan" && (
        latihanActiveId ? (
          <LatihanSoal 
            type={latihanActiveId} 
            onBack={() => setLatihanActiveId(null)} 
          />
        ) : (
          <LatihanPage 
            onSelectLatihan={(id) => setLatihanActiveId(id)} 
          />
        )
      )}

      {/* ─── TAB: PROFIL (Memanggil ProfilPage asli) ─── */}
      {tab === "profil" && (
        <ProfilPage 
          user={user} 
          onLogout={handleLogout} 
          avatars={AVATARS} 
        />
      )}

      {/* ─── SUB-HALAMAN: EKSPLORASI ─── */}
      {tab === "eksplorasi" && (
        <EksplorasiPage onBack={() => setTab("home")} />
      )}


      {/* ─── SUB-HALAMAN: KUIS (Memanggil KuisIntro) ─── */}
      {tab === "kuis" && (
        <KuisIntro onBack={() => setTab("home")} user={user} setUser={setUser} />
      )}

      {/* ─── SUB-HALAMAN: ALAT MUSIK (Memanggil AlatMusikPage) ─── */}
      {tab === "alatmusik" && (
        <AlatMusikPage onBack={() => setTab("home")} />
      )}

      {/* ─── BOTTOM NAVIGATION ─── */}
      {/* Navigasi disembunyikan jika user sedang fokus belajar di dalam sub-materi atau pengerjaan soal */}
      {!materiActiveId && !latihanActiveId && ["home", "materi", "latihan", "profil"].includes(tab) && (
        <BottomNav tab={tab} setTab={setTab} />
      )}
    </div>
  );
}
