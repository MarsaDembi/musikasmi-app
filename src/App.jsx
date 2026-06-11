import { useState, useEffect} from "react";
import "././App.css";
import { db } from "/firebase"; // <-- Pastikan path import firebase.js kamu benar
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth"; // <-- Pastikan ini ada di bagian atas file App.jsx jika ditaruh satu file, atau diimpor dengan benar.
import { auth } from "/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import React from 'react'; // Tambahkan ini di baris pertama file App.jsx
// ─── 10. KONFIGURASI GLOBAL PENYELARASAN NAMA TOOLS (POIN 10) ──────────────────
const TOOLS_CONFIG = {
  home: { label: "Beranda", icon: "🏠" },
  materi: { label: "Materi", icon: "📚" },
  latihan: { label: "Latihan", icon: "✏️" },
  profil: { label: "Profil", icon: "👤" }, // Poin 3 & Poin 10
  eksplorasi: { label: "Eksplorasi", icon: "🎧" },
  kuis: { label: "Kuis", icon: "🏆" },
  alatmusik: { label: "Alat Musik", icon: "🎸" }
};

// ─── DATA ORIGINAL MUSIKAMI ──────────────────────────────────────────────────
const AVATARS = ["👩", "👨", "👧", "👦", "👱‍♀️", "👱‍♂️"];
const MATERI_LIST = [
  { id:"ritme",    icon:"🥁", color:"#f97316", title:"Irama / Ritme", sub:"Pola ketukan dalam musik" },
  { id:"tempo",    icon:"⏱️", color:"#ec4899", title:"Tempo",        sub:"Cepat lambatnya musik" },
  { id:"melodi",   icon:"🎵", color:"#eab308", title:"Melodi",       sub:"Rangkaian nada yang indah" },
  { id:"harmoni",  icon:"🎹", color:"#22c55e", title:"Harmoni",      sub:"Paduan nada yang selaras" },
  { id:"dinamika", icon:"🔊", color:"#3b82f6", title:"Dinamika",     sub:"Keras lembutnya musik" },
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
    video: "https://www.youtube.com/embed/313fqaSAvKw" // <-- Sudah Diperbaiki
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
    video: "https://www.youtube.com/embed/4Rbhktvk-yE" // <-- Sudah Diperbaiki
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
    video: "https://www.youtube.com/embed/bX0GB8qVvqY" // <-- Sudah Diperbaiki
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
    video: "https://www.youtube.com/embed/CaQx38pjCMo" // <-- Sudah Diperbaiki
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
    video: "https://www.youtube.com/embed/G16Op3wlhpQ" // <-- Sudah Diperbaiki
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
    video: "https://www.youtube.com/embed/QTojBPumC-M" // <-- Sudah Diperbaiki
  }
};

const QUIZ_QUESTIONS = [
  { q: "Apa yang dimaksud dengan irama dalam musik?", opts: ["Tinggi rendahnya nada", "Pola ketukan yang teratur", "Keras lembutnya bunyi", "Kecepatan musik"], ans: 1 },
  { q: "Satuan kecepatan musik (BPM) merupakan singkatan dari...", opts: ["Big Piano Music", "Beats Per Minute", "Bass Piano Melody", "Bunyi Per Menit"], ans: 1 },
  { q: "Melodi yang bergerak dari nada rendah ke tinggi disebut...", opts: ["Descending", "Harmoni", "Ascending", "Dinamika"], ans: 2 },
  { q: "Istilah 'Forte' dalam dinamika musik berarti...", opts: ["Sangat lembut", "Lembut", "Keras", "Sangat keras"], ans: 2 },
  { q: "Perpaduan dua atau lebih nada secara bersamaan disebut...", opts: ["Melodi", "Ritme", "Harmoni", "Tempo"], ans: 2 },
  { q: "Tanda 'p' dalam notasi musik melambangkan...", opts: ["Piano (lembut)", "Presto (cepat)", "Pentatonik", "Portato"], ans: 0 },
  { q: "Birama 4/4 berarti...", opts: ["4 nada per bar", "4 ketukan per bar", "4 instrumen", "4 bar per lagu"], ans: 1 },
  { q: "Largo adalah istilah tempo yang berarti...", opts: ["Sangat cepat", "Sedang", "Sangat lambat", "Agak cepat"], ans: 2 },
  { q: "Notasi do-re-mi-fa-sol-la-si adalah contoh dari...", opts: ["Harmoni", "Dinamika", "Irama", "Melodi"], ans: 3 },
  { q: "Crescendo dalam dinamika berarti...", opts: ["Berangsur lembut", "Tiba-tiba keras", "Berangsur keras", "Tiba-tiba lembut"], ans: 2 },
];



const LATIHAN_TYPES = [
  { id: "tempo",    icon: "⏱️", title: "Latihan Tempo",   sub: "Kenali cepat lambatnya musik" },
  { id: "irama",    icon: "🥁", title: "Latihan Irama",   sub: "Kenali pola ketukan musik" },
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

// ─── MAIN APP COMPONENT ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); 
  const [tab, setTab] = useState("home");        
  const [materiActiveId, setMateriActiveId] = useState(null); 
  const [latihanActiveId, setLatihanActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State Poin 2: Pengenalan Tools Onboarding
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Monitor Status Login Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const dbData = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              name: dbData.name || "Siswa MUSIKAMI",
              avatarIdx: dbData.avatarIdx !== undefined ? dbData.avatarIdx : 0,
              progress: dbData.progress !== undefined ? dbData.progress : 0,
              quizBest: dbData.quizBest !== undefined ? dbData.quizBest : 0,
              email: dbData.email || firebaseUser.email
            });
          } else {
            setUser({ uid: firebaseUser.uid, name: "Siswa Baru", avatarIdx: 0, progress: 0, quizBest: 0, email: firebaseUser.email });
          }

          // ─── KONDISI BARU: JIKA YANG LOGIN ADALAH ADMIN ───────────────────
          if (firebaseUser.email === "admin@musikami.com") {
            setScreen("admin");
          } else {
            // Jika siswa biasa, alihkan ke onboarding atau main
            setScreen(hasSeenOnboarding ? "main" : "onboarding");
          }
          
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(null);
        setScreen("login");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [hasSeenOnboarding]);

  // Handler update data Firestore
  const updateUserProgressInDb = async (newData) => {
    if (!user?.uid) return;
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", user.uid), newData);
      setUser(prev => ({ ...prev, ...newData }));
    } catch (e) {
      console.error("Gagal sinkronisasi data cloud:", e);
    }
  };

  // Poin 8 & Poin 5: Interseptor Navigasi Global Bar Bawah
  const handleTabChange = (targetTab) => {
    if (targetTab === "materi") {
      setMateriActiveId(null); 
    }
    if (targetTab === "latihan") {
      setLatihanActiveId(null); 
    }
    setTab(targetTab);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setHasSeenOnboarding(false);
    setTab("home");
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "3rem", fontFamily: "system-ui" }}>Memuat Aplikasi... ⏳</div>;
  }

  // ─── PERUBAHAN PADA SCREEN VIEW ROUTER ─────────────────────────────────────
  if (screen === "login") {
    return <LoginScreen onLoginSuccess={(u) => { 
      setUser(u); 
      if (u.email === "admin@musikami.com") {
        setScreen("admin");
      } else {
        setScreen("onboarding"); 
      }
    }} />;
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={() => { setHasSeenOnboarding(true); setScreen("main"); setTab("home"); }} />;
  }

  // JIKA SCREEN ADALAH ADMIN, AKAN LANGSUNG MERENDER ADMIN DASHBOARD TANPA FOOTBAR
  if (screen === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // SCREEN SISWA BIASA (MAIN SCREEN)
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center" }}>
      <div style={{ 
        width: "100%", maxWidth: "450px", minHeight: "100vh", background: "#fff", 
        display: "flex", flexDirection: "column", position: "relative",
        boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        paddingBottom: "110px" 
      }}>
        
        {tab === "home" && (
          <Home user={user} setTab={handleTabChange} 
                onOpenEksplorasi={() => setTab("eksplorasi")} 
                onOpenKuis={() => setTab("kuis")} 
                onOpenAlatMusik={() => setTab("alatmusik")}
                onOpenPengembang={() => setTab("pengembang")} />
        )}

        {tab === "pengembang" && (
          <ProfilPengembangPage onBack={() => setTab("home")} />
        )}

        {tab === "materi" && (
          materiActiveId ? (
            <MateriDetail 
              id={materiActiveId} 
              user={user} 
              onBack={() => setMateriActiveId(null)}
              onCompleteMateri={(currentId) => {
  const currentIdx = MATERI_LIST.findIndex(x => x.id === currentId);
  if (currentIdx !== -1 && currentIdx === user.progress) {
    updateUserProgressInDb({ progress: Math.min(user.progress + 1, MATERI_LIST.length) });
  }
  
  if (currentIdx !== -1 && currentIdx + 1 < MATERI_LIST.length) {
    // 1. Ganti ID materi ke materi berikutnya
    setMateriActiveId(MATERI_LIST[currentIdx + 1].id);
    
    // 2. OTOMATIS PAKSA SCROLL CONTAINER KE ATAS LANGSUNG DI SINI
    setTimeout(() => {
      // Cari elemen div yang bertanggung jawab atas scroll di aplikasi kamu
      // Kita cari berdasarkan properti style overflowY yang menampung halaman materi
      const containers = document.querySelectorAll("div");
      containers.forEach((div) => {
        if (div.style.overflowY === "auto" || div.style.overflowY === "scroll" || div.scrollTop > 0) {
          div.scrollTop = 0; // Paksa scroll internal ke paling atas
        }
      });
      
      // Tetap jalankan scroll layar utama browser sebagai cadangan
      window.scrollTo(0, 0);
    }, 50); // Diberi delay 50ms agar React selesai merender teks materi baru terlebih dahulu

  } else {
    alert("Selamat! Semua bab materi telah selesai kamu pelajari! 🥳");
    setMateriActiveId(null);
  }
}}
            />
          ) : (
            <MateriPage user={user} onOpenDetail={(id) => setMateriActiveId(id)} />
          )
        )}

        {tab === "latihan" && (
          latihanActiveId ? (
            <LatihanSoalCore type={latihanActiveId} onBack={() => setLatihanActiveId(null)} />
          ) : (
            <LatihanPage onSelectLatihan={(id) => setLatihanActiveId(id)} />
          )
        )}

        {tab === "profil" && <ProfilPage user={user} onLogout={handleLogout} />}
        {tab === "eksplorasi" && <EksplorasiPage onBack={() => setTab("home")} />}
        
        {tab === "kuis" && (
          <KuisCore 
            user={user} 
            onBack={() => setTab("home")} 
            onSaveScore={(skor) => {
              if (skor > (user?.quizBest || 0)) {
                updateUserProgressInDb({ quizBest: skor });
              }
            }} 
          />
        )}

        {/* FOOTBAR FLOATING */}
        <BottomNav tab={tab} setTab={handleTabChange} />
      </div>
    </div>
  );
}

// ─── COMPONENT 1: HEADER GLOBAL ──────────────────────────────────────────────
function Header({ title, sub, onBack, right }) {
  return (
    <div style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",padding:"1rem 1.25rem",display:"flex",alignItems:"center",gap:"0.75rem",color:"#fff"}}>
      {onBack && (
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
      )}
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:"1.05rem"}}>{title}</div>
        <div style={{fontSize:"0.78rem",opacity:0.85}}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

// ─── COMPONENT 2: LOGIN SCREEN + TUTORIAL PETUNJUK (POIN 1) ─────────────────
function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name.trim()) return alert("Nama tidak boleh kosong!");

    setIsLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const u = userCredential.user;
        const { doc, setDoc } = await import("firebase/firestore"); 
        await setDoc(doc(db, "users", u.uid), {
          uid: u.uid, name: name.trim(), avatarIdx: avatar, email: email.trim(), progress: 0, quizBest: 0, createdAt: new Date()
        });
        alert("Pendaftaran Berhasil! 🚀");
        onLoginSuccess({ uid: u.uid, name: name.trim(), avatarIdx: avatar, progress: 0, quizBest: 0, email: email.trim() });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const u = userCredential.user;
        const { doc, getDoc } = await import("firebase/firestore");
        const docSnap = await getDoc(doc(db, "users", u.uid));
        if (docSnap.exists()) {
          const d = docSnap.data();
          onLoginSuccess({ uid: u.uid, name: d.name, avatarIdx: d.avatarIdx ?? 0, progress: d.progress || 0, quizBest: d.quizBest || 0, email: d.email });
        }
      }
    } catch (error) {
      alert("Autentikasi gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "linear-gradient(160deg,#f3e8ff 0%,#fce7f3 50%,#fff7ed 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", boxSizing: "border-box" }}>
      <div style={{ fontSize: "3rem", marginBottom: "0.2rem" }}>🎵</div>
      <div style={{ fontFamily: "system-ui", fontSize: "1.8rem", fontWeight: 900, background: "linear-gradient(90deg,#7c3aed,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem" }}>MUSIKAMI</div>
      <div style={{ color: "#4b5563", fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>Aplikasi Unsur Musik untuk SD/MI</div>

      {/* 📘 1. PETUNJUK TUTORIAL LOGIN (POIN 1) */}
      <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "10px 12px", borderRadius: 8, width: "100%", maxWidth: 420, boxSizing: "border-box", fontSize: "0.78rem", color: "#1e3a8a", marginBottom: "1rem", lineHeight: "1.4" }}>
        <b style={{ display: "block", marginBottom: "3px" }}>💡 Panduan Memasuki Aplikasi:</b>
        1. Klik <span style={{ textDecoration: "underline", fontWeight: "bold" }}>Daftar di sini</span> di paling bawah jika baru pertama kali memakai aplikasi.<br />
        2. Masukkan Alamat Email sekolah/pribadi dan kata sandi minimal 6 huruf/angka.<br />
        3. Ketuk tombol ungu <b style={{color: "#7c3aed"}}>Masuk / Mulai Belajar</b> untuk konfirmasi data.
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(124,58,237,0.08)", boxSizing: "border-box" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {isSignUp && (
            <>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "0.25rem" }}>Siapa namamu?</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ketik namamu..." required style={{ width: "100%", padding: "0.7rem", border: "1.5px solid #e5e7eb", borderRadius: 10, boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.4rem" }}>Pilih avatarmu:</div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {AVATARS.map((a, i) => (
                    <button type="button" key={i} onClick={() => setAvatar(i)} style={{ fontSize: "1.6rem", padding: "0.3rem", borderRadius: 10, border: avatar === i ? "2.5px solid #7c3aed" : "2px solid transparent", background: avatar === i ? "#f3e8ff" : "#f9fafb", cursor: "pointer" }}>{a}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "0.25rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required style={{ width: "100%", padding: "0.7rem", border: "1.5px solid #e5e7eb", borderRadius: 10, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "0.25rem" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter..." required minLength={6} style={{ width: "100%", padding: "0.7rem", border: "1.5px solid #e5e7eb", borderRadius: 10, boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "0.9rem", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", fontWeight: 700, cursor: "pointer", marginTop: "0.4rem" }}>
            {isLoading ? "Memproses... ⏳" : isSignUp ? "Mulai Belajar! 🚀" : "Masuk Aplikasi 🔓"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.82rem", color: "#666" }}>
          {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
            {isSignUp ? "Masuk di sini" : "Daftar di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT 3: INTRO / ONBOARDING PENGENALAN TOOLS (POIN 2) ───────────────
function OnboardingScreen({ onComplete }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", boxSizing: "border-box", fontFamily: "system-ui" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#fff", padding: "1.5rem", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.25rem", fontWeight: 800 }}>👋 Halo Selamat Datang!</h3>
        <p style={{ margin: "0 0 1rem 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>Sebelum menjelajah, kenali dulu nama dan arti tombol pintasan (*tools*) yang ada di bagian bawah aplikasi:</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
          {["home", "materi", "latihan", "profil"].map((key) => (
            <div key={key} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#faf5ff", padding: "10px", borderRadius: 12, border: "1px solid #f3e8ff" }}>
              <span style={{ fontSize: "1.4rem" }}>{TOOLS_CONFIG[key].icon}</span>
              <div>
                <b style={{ fontSize: "0.85rem", color: "#1e1b4b", display: "block" }}>{TOOLS_CONFIG[key].label}</b>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {key === "home" && "Membuka halaman beranda informasi utama siswa."}
                  {key === "materi" && "Melihat ragam 6 jenis materi dasar musik lengkap."}
                  {key === "latihan" && "Mencoba rincian pengerjaan soal latihan mandiri."}
                  {key === "profil" && "Melihat riwayat akun serta identitas tim pengembang."}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onComplete} style={{ width: "100%", padding: "0.9rem", background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
          Saya Paham, Masuk Beranda 🎯
        </button>
      </div>
    </div>
  );
}

// ─── KOMPONEN DASHBOARD ADMIN (Sekitar Baris 479) ──────────────────────────
function AdminDashboard({ onLogout }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false); // Default false untuk menghindari cascading render awal
  const [searchTerm, setSearchTerm] = useState("");

  const TOTAL_MATERI = 6;

  // fetchUsers diperbaiki agar aman dipanggil di dalam useEffect
  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email !== "admin@musikami.com") {
            usersData.push({ id: doc.id, ...data });
          }
        });
        if (isMounted) setUsersList(usersData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; // Cleanup untuk mencegah memory leak
    };
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus data "${userName}"?`
    );

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "users", userId));
        alert("Data berhasil dihapus!");
        setUsersList(usersList.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  const filteredUsers = usersList.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui", paddingBottom: "60px" }}>
      <header style={{ background: "#fff", padding: "1rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Dashboard Admin</h1>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>Panel Kontrol Data Siswa MUSIKAMI</p>
        </div>
        <button onClick={onLogout} style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer" }}>Keluar Sistem</button>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>Kelola Pengguna</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Total: {filteredUsers.length} Siswa</p>
          </div>
          <input 
            type="text" 
            placeholder="Cari nama atau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #cbd5e1", width: "250px" }}
          />
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>Memuat Data... ⏳</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>Tidak ada data ditemukan.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem" }}>Nama Siswa</th>
                  <th style={{ padding: "1rem" }}>Email</th>
                  <th style={{ padding: "1rem" }}>Progres Materi</th>
                  <th style={{ padding: "1rem", textAlign: "center" }}>Skor Kuis</th>
                  <th style={{ padding: "1rem", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const progress = Math.round(((u.progress || 0) / TOTAL_MATERI) * 100);
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: "1rem", color: "#64748b" }}>{u.email}</td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ width: `${progress}%`, height: "100%", background: "#4f46e5" }}></div>
                          </div>
                          <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center", fontWeight: "bold", color: "#ec4899" }}>{u.quizBest || 0}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <button onClick={() => handleDeleteUser(u.id, u.name)} style={{ padding: "0.4rem 0.8rem", background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer" }}>Hapus 🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── PENGGUNAAN DI FUNGSI UTAMA (Saran Struktur Routing/Kondisi Login) ───────
// Pastikan komponen ini dipanggil di fungsi utama App() kamu, misalnya seperti ini:
/*
function App() {
  const [user, setUser] = useState(null); // Nilai dari Firebase Auth Anda

  if (user?.email === "admin@musikami.com") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    // Penampilan halaman siswa biasa (Beranda, Materi, ProfilPage, dll)
  );
}
*/



// ─── COMPONENT 4: BERANDA DENGAN PENYELARASAN NAMA TOOLS (POIN 10) ───────────
// ─── COMPONENT: HOME (SUDAH DISESUAIKAN UNTUK PROFIL PENGEMBANG) ───────────────
function Home({ user, setTab, onOpenEksplorasi, onOpenKuis, onOpenPengembang }) { // <-- Mengganti onOpenAlatMusik dengan onOpenPengembang
  const currentProgress = user?.progress || 0;
  const progressPercent = Math.round((currentProgress / MATERI_LIST.length) * 100);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      {/* HEADER UTAMA */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.4rem" }}>🎵</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem" }}>MUSIKAMI</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.85 }}>Musik Interaktif MI</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "0.3rem 0.85rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600 }}>
          <span>{AVATARS[user?.avatarIdx] || "👤"}</span>
          <span>{user?.name || "Siswa"}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ background: "#fff", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid #f0e8ff" }}>
        <span style={{ color: "#555" }}>Progres Belajar</span>
        <span style={{ color: "#7c3aed", fontWeight: 600 }}>{progressPercent}%</span>
      </div>
      <div style={{ height: 6, background: "#f0e8ff" }}>
        <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* KARTU SALAM */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1rem", display: "flex", alignItems: "center", gap: "0.85rem", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
          <span style={{ fontSize: "2rem" }}>🎶</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Halo, {user?.name}! 👋</div>
            <div style={{ color: "#888", fontSize: "0.8rem" }}>Ayo belajar unsur-unsur musik hari ini!</div>
          </div>
        </div>

        {/* NAVIGATION GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button onClick={() => setTab("materi")} style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{TOOLS_CONFIG.materi.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{TOOLS_CONFIG.materi.label}</div>
            <div style={{ color: "#aaa", fontSize: "0.72rem" }}>Pelajari unsur musik</div>
          </button>

          <button onClick={onOpenEksplorasi} style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{TOOLS_CONFIG.eksplorasi.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{TOOLS_CONFIG.eksplorasi.label}</div>
            <div style={{ color: "#aaa", fontSize: "0.72rem" }}>Dengarkan & rasakan</div>
          </button>

          <button onClick={() => setTab("latihan")} style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{TOOLS_CONFIG.latihan.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{TOOLS_CONFIG.latihan.label}</div>
            <div style={{ color: "#aaa", fontSize: "0.72rem" }}>Uji pemahamanmu</div>
          </button>

          <button onClick={onOpenKuis} style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{TOOLS_CONFIG.kuis.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{TOOLS_CONFIG.kuis.label}</div>
            <div style={{ color: "#aaa", fontSize: "0.72rem" }}>Evaluasi belajar</div>
          </button>
        </div>

        {/* TOMBOL HALAMAN PROFIL PENGEMBANG (YANG SUDAH DISESUAIKAN) */}
        <button onClick={onOpenPengembang} style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", width: "100%", textAlign: "left" }}>
          <span style={{ fontSize: "1.8rem" }}>💻</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>Profil Pengembang</div>
            <div style={{ color: "#aaa", fontSize: "0.72rem" }}>Tim Penyusun UIN SGD Bandung</div>
          </div>
        </button>

        {/* AKTIVITAS TERAKHIR */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1rem", boxShadow: "0 2px 8px rgba(124,58,237,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            <span>📊</span> Aktivitas Terakhir
          </div>
          {currentProgress === 0 ? (
            <div style={{ color: "#bbb", fontSize: "0.8rem", textAlign: "center", padding: "0.5rem 0" }}>Belum ada aktivitas. Ayo mulai belajar!</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {MATERI_LIST.slice(0, currentProgress).map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", padding: "0.3rem 0", borderBottom: "1px solid #faf5ff" }}>
                  <span>{m.icon}</span><span style={{ flex: 1 }}>{m.title}</span>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>✓ Selesai</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── COMPONENT: HALAMAN PROFIL PENGEMBANG (DATA DIRETRIF) ────────────────────
function ProfilPengembangPage({ onBack }) {
  // Data Pengembang dan Dosen Pembimbing UIN Sunan Gunung Djati Bandung
  const timPengembang = [
    {
      nama: "Thifal Zain Taqiyyah",
      role: "Pengembang Utama / Mahasiswi",
      identitas: "Prodi Pendidikan Guru Madrasah Ibtidaiyah",
      avatar: "👩‍💻",
      deskripsi: "Thifal Zain Taqiyyah merupakan mahasiswi Pendidikan Guru Madrasah Ibtidaiyah UIN Sunan Gunung Djati Bandung yang merancang dan mengembangkan media pembelajaran interaktif MUSIKAMI ini."
    },
    {
      nama: "Dr. H. Dadan F. Ramdhan, M.Ag., M.M.Pd.",
      role: "Dosen Pembimbing I",
      identitas: "NIP / Dosen PGMI",
      avatar: "👨‍🏫",
      deskripsi: "Dr. H. Dadan F. Ramdhan, M.Ag.,M.M.Pd. merupakan dosen Pendidikan Guru Madrasah Ibtidaiyah UIN Sunan Gunung Djati Bandung yang bertindak sebagai pembimbing dalam penyusunan dan validasi media pembelajaran ini."
    },
    {
      nama: "Kawuryansih Widowati, M.A.",
      role: "Dosen Pembimbing II",
      identitas: "NIP / Dosen PGMI",
      avatar: "👩‍🏫",
      deskripsi: "Kawuryansih Widowati, M.A merupakan dosen Pendidikan Guru Madrasah Ibtidaiyah UIN Sunan Gunung Djati Bandung yang turut membimbing, memberikan arahan materi, serta meneliti kesesuaian unsur musik untuk tingkat SD/MI."
    }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "5rem", fontFamily: "system-ui", background: "#faf8ff", minHeight: "100vh" }}>
      
      {/* 🟣 HEADER */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", color: "#fff", padding: "1.5rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", padding: 0 }}>
          &lt;
        </button>
        <div>
          <h2 style={{ margin: "0 0 2px 0", fontSize: "1.2rem", fontWeight: "700" }}>Profil Pengembang 💻</h2>
          <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.9 }}>Tim di balik aplikasi MUSIKAMI</p>
        </div>
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* 🏫 KARTU INFORMASI UNIVERSITAS */}
        <div style={{ background: "#fff", padding: "1.2rem", borderRadius: 20, textAlign: "center", border: "1px solid #f0e6ff", boxShadow: "0 4px 12px rgba(124,58,237,0.03)" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🕌</div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#1e1b4b", fontWeight: "800" }}>UIN Sunan Gunung Djati Bandung</h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", fontWeight: "500" }}>
            Fakultas Tarbiyah dan Keguruan <br />
            Jurusan Pendidikan Guru Madrasah Ibtidaiyah (PGMI)
          </p>
        </div>

        {/* 👥 DAFTAR ANGGOTA TIM & DOSEN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569", paddingLeft: "4px" }}>
            TIM PENGEMBANG & PEMBIMBING:
          </div>

          {timPengembang.map((dev, index) => (
            <div 
              key={index} 
              style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 50, height: 50, background: index === 0 ? "#f3e8ff" : "#e0f2fe", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
                  {dev.avatar}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "0.95rem", color: "#0f172a", fontWeight: "800", lineHeight: "1.3" }}>{dev.nama}</h4>
                  <div style={{ fontSize: "0.78rem", color: index === 0 ? "#7c3aed" : "#0284c7", fontWeight: "700", marginBottom: "2px" }}>{dev.role}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{dev.identitas}</div>
                </div>
              </div>
              
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />
              
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", lineHeight: "1.5", textAlign: "justify" }}>
                {dev.deskripsi}
              </p>
            </div>
          ))}
        </div>

        {/* ℹ️ FOOTER KECIL */}
        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.72rem", marginTop: "2rem", lineHeight: "1.4" }}>
          Media Pembelajaran Unsur Musik Interaktif SD/MI.<br />
          &copy; 2026 MUSIKAMI - UIN SGD Bandung. All Rights Reserved.
        </div>

      </div>
    </div>
  );
}
// ─── COMPONENT 5: HALAMAN JENIS MATERI ───────────────────────────────────────
function MateriPage({ user, onOpenDetail, onBack }) {
  const currentProgress = user?.progress || 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title="Materi Unsur Musik" sub="Pilih materi untuk dipelajari" onBack={onBack} />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {MATERI_LIST.map((m, i) => {
          const done = i < currentProgress;
          const isLocked = i > currentProgress;

          return (
            <button key={m.id} disabled={isLocked} onClick={() => onOpenDetail(m.id)}
              style={{
                background: isLocked ? "#f3f4f6" : "#fff", border: "none", borderRadius: 14, padding: "1rem",
                display: "flex", alignItems: "center", gap: "1rem", cursor: isLocked ? "not-allowed" : "pointer",
                textAlign: "left", borderLeft: `4px solid ${isLocked ? "#d1d5db" : m.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", width: "100%", opacity: isLocked ? 0.6 : 1, transition: "all 0.2s"
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: isLocked ? "#e5e7eb" : `${m.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                {isLocked ? "🔒" : m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isLocked ? "#9ca3af" : "#333" }}>{i + 1}. {m.title}</div>
                <div style={{ color: isLocked ? "#cbd5e1" : "#999", fontSize: "0.75rem" }}>{isLocked ? "Selesaikan materi sebelumnya terlebih dahulu" : m.sub}</div>
              </div>
              <span style={{ color: done ? "#22c55e" : isLocked ? "transparent" : "#ddd", fontSize: "1.1rem" }}>{done ? "✓" : "•"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPONENT 6: DETAIL MATERI (POIN 6 & 7) ─────────────────────────────────
function MateriDetail({ id,  onBack, onCompleteMateri }) {
  const m = MATERI_LIST.find(x => x.id === id);
  const d = MATERI_DETAIL[id] || MATERI_DETAIL["ritme"];

  React.useEffect(() => {
    // Jalankan scroll global
    window.scrollTo(0, 0);
    
    // Cari container div yang memiliki scroll internal (jika ada) dan paksa ke koordinat 0
    const scrollContainer = document.getElementById("main-app-container") || document.querySelector("div[style*='overflowY']");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [id]);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title={d.title} sub={m?.sub} onBack={onBack} />

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        
        {/* Deskripsi */}
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", textAlign: "justify" }}>{d.desc}</p>
        </div>

        {/* 📋 6. MARGIN TEKS POIN PENTING RATA KIRI MUTLAK (POIN 6) */}
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#7c3aed", fontSize: "0.9rem", fontWeight: 700, textAlign: "left" }}>📌 Poin-Poin Penting:</h4>
          {d.poin.map((p, idx) => (
            <p key={idx} style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: "#334155", lineHeight: "1.4", textAlign: "left" }}>
              • {p}
            </p>
          ))}
        </div>

        {/* Contoh */}
        <div style={{ background: "#f0fdf4", borderLeft: "4px solid #22c55e", padding: "0.85rem", borderRadius: 8 }}>
          <span style={{ fontSize: "0.8rem", color: "#166534", display: "block" }}><b>💡 Contoh Sederhana:</b> {d.contoh}</span>
        </div>

        {/* 📺 7. TUTORIAL MANUAL PETUNJUK VIDEO (POIN 7) */}
        <div style={{ background: "#fff7ed", border: "1px dashed #f97316", padding: "10px 12px", borderRadius: 10, fontSize: "0.78rem", color: "#c2410c", lineHeight: "1.4" }}>
          <b style={{ display: "block", marginBottom: "3px" }}>📺 Petunjuk Memutar Video Pembelajaran:</b>
          • Klik ikon tombol segitiga tepat di tengah layar untuk <b>Memulai Video</b>.<br />
          • Klik lambang kotak di kanan pojok bawah bingkai untuk <b>Memperbesar (Fullscreen)</b>.<br />
          • Klik lambang kotak itu lagi atau pencet tombol 'ESC' untuk <b>Mengecilkan Layar Kembali</b>.
        </div>

        {/* Bingkai Pemutar Video */}
        <div style={{ width: "100%", height: "200px", background: "#000", borderRadius: 14, overflow: "hidden" }}>
          <iframe width="100%" height="100%" src={d.video} title={d.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>

        {/* 🔄 5. SELESAI LANGSUNG GAS PINDAH KE MATERI BERIKUTNYA (POIN 5) */}
        <button onClick={() => onCompleteMateri(id)}
          style={{ width: "100%", padding: "1rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", marginTop: "0.5rem" }}>
          Telah Selesai Mempelajari & Lanjut Materi Berikutnya ➡️
        </button>
      </div>
    </div>
  );
}


// ─── COMPONENT 7: KATEGORI RUANG LATIHAN ─────────────────────────────────────
function LatihanPage({ onSelectLatihan, onBack }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title="Ruang Latihan" sub="Asah pemahaman teori musikmu" onBack={onBack} />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {LATIHAN_TYPES.map((l) => (
          <div key={l.id} onClick={() => onSelectLatihan(l.id)}
            style={{ background: "#fff", padding: "1rem", borderRadius: 14, cursor: "pointer", border: "1px solid #f0e8ff", display: "flex", alignItems: "center", gap: "0.85rem", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "1.6rem" }}>{l.icon}</span>
            <div>
              <b style={{ fontSize: "0.9rem", color: "#333", display: "block" }}>{l.title}</b>
              <span style={{ fontSize: "0.75rem", color: "#888" }}>{l.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPONENT 8: SOAL LATIHAN CORE (FLEKSIBEL DIACSES KAPAN SAJA - POIN 8) ───
function LatihanSoalCore({ type, onBack }) {
  const listSoal = LATIHAN_SOAL[type] || LATIHAN_SOAL["tempo"];
  const [idx, setIdx] = useState(0);

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "30px" }}>
      <Header title={`Uji ${type.toUpperCase()}`} sub={`Soal Latihan nomor ${idx + 1}`} onBack={onBack} />
      <div style={{ padding: "1rem" }}>
        
        <div style={{ background: "#fee2e2", padding: "8px 12px", borderRadius: 8, fontSize: "0.75rem", color: "#991b1b", marginBottom: "1rem" }}>
          ℹ️ <b>Info Bebas:</b> Kamu bisa langsung berpindah menu lewat tombol navigasi bar bawah kapan saja jika ingin membatalkan latihan ini. (Poin 8)
        </div>

        <div style={{ background: "#fff", padding: "1.1rem", borderRadius: 14, border: "1px solid #f0e8ff", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <p style={{ margin: "0 0 1rem 0", fontWeight: 700, fontSize: "0.92rem", color: "#221c7a" }}>{listSoal[idx].q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {listSoal[idx].opts.map((o, oIdx) => (
              <button key={oIdx} onClick={() => { alert(oIdx === listSoal[idx].ans ? "Jawabanmu Benar! 🎉" : "Kurang tepat, coba lagi ya!"); }}
                style={{ padding: "0.75rem", textAlign: "left", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: "0.85rem", cursor: "pointer" }}>
                {o}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button disabled={idx === 0} onClick={() => setIdx(p => p - 1)} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "none", background: "#cbd5e1", cursor: "pointer" }}>Sebelumnya</button>
          {idx < listSoal.length - 1 ? (
            <button onClick={() => setIdx(p => p + 1)} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer" }}>Selanjutnya</button>
          ) : (
            <button onClick={onBack} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer" }}>Selesai Latihan</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT 9: KUIS CORE + TOMBOL NAVIGASI SEBELUM/SESUDAH (POIN 9) ────────
function KuisCore({ user, onBack, onSaveScore }) {
  const [start, setStart] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!start) {
    return (
      <div style={{ flex: 1, padding: "1rem", textAlign: "center", fontFamily: "system-ui" }}>
        <Header title="Evaluasi Kuis" sub="Uji Nilai Akhir" onBack={onBack} />
        <div style={{ padding: "2rem 1rem" }}>
          <span style={{ fontSize: "3rem" }}>🏆</span>
          <h3 style={{ margin: "10px 0" }}>Kuis Besar MUSIKAMI</h3>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>Skor Tertinggi Kamu Saat Ini: <b>{user?.quizBest || 0} / 100</b></p>
          <button onClick={() => setStart(true)} style={{ marginTop: "1rem", padding: "0.85rem 2rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Mulai Kuis Sekarang</button>
        </div>
      </div>
    );
  }

  const handleFinish = () => {
    let betul = 0;
    QUIZ_QUESTIONS.forEach((q, i) => { if (answers[i] === q.ans) betul++; });
    const totalSkor = Math.round((betul / QUIZ_QUESTIONS.length) * 100);
    onSaveScore(totalSkor);
    alert(`Kuis selesai! Skor pencapaian ujianmu: ${totalSkor} / 100`);
    setStart(false);
    setCurrentIdx(0);
    setAnswers({});
    onBack();
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <Header title="Kuis Kompetensi" sub={`Pertanyaan ${currentIdx + 1} dari ${QUIZ_QUESTIONS.length}`} />
      <div style={{ padding: "1rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>{QUIZ_QUESTIONS[currentIdx].q}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
          {QUIZ_QUESTIONS[currentIdx].opts.map((opt, oIdx) => (
            <button key={oIdx} onClick={() => setAnswers({ ...answers, [currentIdx]: oIdx })}
              style={{ padding: "0.8rem", textAlign: "left", borderRadius: 10, border: answers[currentIdx] === oIdx ? "2px solid #7c3aed" : "1px solid #e5e7eb", background: answers[currentIdx] === oIdx ? "#f3e8ff" : "#fff", cursor: "pointer" }}>
              {opt}
            </button>
          ))}
        </div>

        {/* 🔘 9. NAVIGASI TOMBOL PERTANYAAN SEBELUMNYA & SESUDAHNYA (POIN 9) */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)}
            style={{ flex: 1, padding: "0.75rem", background: currentIdx === 0 ? "#e5e7eb" : "#64748b", color: currentIdx === 0 ? "#9ca3af" : "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: currentIdx === 0 ? "not-allowed" : "pointer" }}>
            ⬅️ Soal Sebelumnya
          </button>

          {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
            <button onClick={() => setCurrentIdx(p => p + 1)}
              style={{ flex: 1, padding: "0.75rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
              Soal Selanjutnya ➡️
            </button>
          ) : (
            <button onClick={handleFinish}
              style={{ flex: 1, padding: "0.75rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
              Selesai & Kirim 💾
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT 3: PROFIL PENCIPTA & PENGEMBANG (POIN 3 & 10) ─────────────────
function ProfilPage({ user, onLogout }) {
  // Angka progres atau nilai bisa dibuat dinamis dari properti user jika ada,
  // atau menggunakan nilai default sesuai gambar UI kamu.
  const progresPersen = user?.progres || 100;
  const materiSelesai = user?.materiSelesai || 6;
  const totalMateri = user?.totalMateri || 6;
  const skorKuis = user?.nilaiKuis || 90;

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem", fontFamily: "system-ui", background: "#f5f0ff", minHeight: "100vh" }}>
      
      {/* 🟣 Header Gradient */}
      <div style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", color: "#fff", padding: "1.5rem 1rem", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", fontWeight: "700" }}>Profil Akun</h2>
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9 }}>Detail informasi belajar Anda</p>
      </div>

      {/* 👩‍💼 Area Avatar & Nama */}
      <div style={{ textAlign: "center", marginTop: "-2rem", padding: "0 1rem" }}>
        {/* Lingkaran Avatar */}
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#efe6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.8rem auto", fontSize: "3rem", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          👩
        </div>
        
        {/* Nama Pengguna & Status */}
        <h2 style={{ margin: "0 0 4px 0", color: "#1e293b", fontSize: "1.5rem", fontWeight: "700" }}>
          {user?.name || "marsa dembi"}
        </h2>
        <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.95rem", color: "#64748b" }}>
          Status Belajar: <span style={{ color: "#8b5cf6", fontWeight: "500" }}>Level SD/MI</span>
        </p>
      </div>

      {/* 📊 Container Card List */}
      <div style={{ padding: "0 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* 📉 Card 1: Progres Kelulusan Materi */}
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 16, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
              📊 Progres Kelulusan Materi
            </span>
            <span style={{ fontWeight: "800", color: "#7c3aed", fontSize: "1.1rem" }}>
              {progresPersen}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginBottom: "0.8rem" }}>
            <div style={{ width: `${progresPersen}%`, height: "100%", background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)", borderRadius: 999 }} />
          </div>
          
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
            Kamu telah menyelesaikan <b>{materiSelesai}</b> dari <b>{totalMateri}</b> materi.
          </p>
        </div>

        {/* 🏆 Card 2: Nilai Kuis Tertinggi */}
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 16, textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "4px" }}>
            🏆 Nilai Kuis Tertinggi
          </span>
          <h1 style={{ margin: 0, fontSize: "2.8rem", fontWeight: "800", color: "#ec4899" }}>
            {skorKuis}
          </h1>
        </div>

        {/* 🚪 Tombol Keluar Akun */}
        <button 
          onClick={onLogout} 
          style={{ width: "100%", padding: "0.9rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "0.5rem", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}
        >
          Keluar Akun 🚪
        </button>

      </div>
    </div>
  );
}

// ─── COMPONENT PENDUKUNG MOCK VIEW ───────────────────────────────────────────
// ─── COMPONENT: HALAMAN EKSPLORASI BERSUARA (SUDAH DISESUAIKAN) ───────────────
function EksplorasiPage({ onBack }) { // <-- Ditambahkan props onBack untuk tombol kembali
  // State untuk melacak item yang sedang aktif/diklik
  const [activeTempo, setActiveTempo] = useState(null);
  const [activeIrama, setActiveIrama] = useState(null);
  const [activeDinamika, setActiveDinamika] = useState(null);

  // Fungsi memutar bunyi/suara dengan Web Audio API tanpa membutuhkan file .mp3 luar
  const playSound = (type, name) => {
    console.log(`Memutar suara ${type}: ${name}`);
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // 1. LOGIKA UNTUK BUNYI TEMPO (Bunyi ketukan Metronome)
      if (type === 'tempo') {
        let bpm = 120; // Default Moderato
        if (name === 'Largo') bpm = 60;   // Lambat
        if (name === 'Allegro') bpm = 160; // Cepat
        
        const interval = 60 / bpm;
        // Simulasikan 3 ketukan metronome beruntun sesuai kecepatan tempo
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(600, ctx.currentTime + (i * interval));
          gain.gain.setValueAtTime(0.2, ctx.currentTime + (i * interval));
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * interval) + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + (i * interval));
          osc.stop(ctx.currentTime + (i * interval) + 0.1);
        }
      }
      
      // 2. LOGIKA UNTUK BUNYI IRAMA (Simulasi pola Tepuk Tangan/Perkusi)
      else if (type === 'irama') {
        let count = 4; // Default 4/4
        if (name === '2/4') count = 2;
        if (name === '3/4') count = 3;
        
        const interval = 0.4; // Jeda antar ketukan tetap
        for (let i = 0; i < count; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          // Ketukan pertama dibuat lebih tinggi (Aksen kuat: Plak!) sisanya lebih rendah (Duk!)
          const freq = i === 0 ? 800 : 400; 
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * interval));
          gain.gain.setValueAtTime(0.25, ctx.currentTime + (i * interval));
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * interval) + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + (i * interval));
          osc.stop(ctx.currentTime + (i * interval) + 0.15);
        }
      }
      
      // 3. LOGIKA UNTUK BUNYI DINAMIKA (Nada Piano Lembut vs Keras)
      else if (type === 'dinamika') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime); // Nada A4 (Do)
        
        // Atur volume (Gain) berdasarkan pilihan dinamika
        const volume = name === 'Keras' ? 0.6 : 0.08; 
        
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
      
    } catch (e) {
      console.error("Browser tidak mendukung Web Audio API", e);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "5rem", fontFamily: "system-ui", background: "#fcf9ff", minHeight: "100vh" }}>
      
      {/* 🟣 1. HEADER GRADIENT DENGAN TOMBOL KEMBALI */}
      <div style={{ background: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)", color: "#fff", padding: "1.5rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Hubungkan onClick ke properti onBack agar fungsi kembali ke home berjalan */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", padding: 0 }}>
          &lt;
        </button>
        <div>
          <h2 style={{ margin: "0 0 2px 0", fontSize: "1.3rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
            Eksplorasi Bunyi 🎧
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9 }}>Dengarkan dan rasakan musik</p>
        </div>
      </div>

      {/* 💡 2. BOX TIPS */}
      <div style={{ padding: "1rem" }}>
        <div style={{ background: "#fae8ff", border: "1px solid #f5d0fe", padding: "0.8rem 1rem", borderRadius: 14, display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#a21caf", fontWeight: "500", lineHeight: "1.4" }}>
            <b>Tips:</b> Tekan tombol untuk mendengarkan contoh bunyi. Perhatikan perbedaannya!
          </p>
        </div>
      </div>

      {/* 📜 KONTEN EKSPLORASI */}
      <div style={{ padding: "0 1rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        
        {/* ⏱️ SECTION 1: EKSPLORASI TEMPO */}
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a", fontSize: "1.05rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
            ⏱️ Eksplorasi Tempo
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
            {/* Lambat */}
            <div 
              onClick={() => { setActiveTempo('largo'); playSound('tempo', 'Largo'); }}
              style={{ background: "#eff6ff", padding: "1rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeTempo === 'largo' ? "2px solid #3b82f6" : "2px solid transparent", transition: "0.2s" }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🐢</div>
              <b style={{ color: "#1d4ed8", fontSize: "0.9rem", display: "block" }}>Lambat</b>
              <span style={{ color: "#60a5fa", fontSize: "0.75rem" }}>Largo</span>
            </div>
            {/* Sedang */}
            <div 
              onClick={() => { setActiveTempo('moderato'); playSound('tempo', 'Moderato'); }}
              style={{ background: "#f0fdf4", padding: "1rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeTempo === 'moderato' ? "2px solid #22c55e" : "2px solid transparent", transition: "0.2s" }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🚶</div>
              <b style={{ color: "#15803d", fontSize: "0.9rem", display: "block" }}>Sedang</b>
              <span style={{ color: "#4ade80", fontSize: "0.75rem" }}>Moderato</span>
            </div>
            {/* Cepat */}
            <div 
              onClick={() => { setActiveTempo('allegro'); playSound('tempo', 'Allegro'); }}
              style={{ background: "#fff1f2", padding: "1rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeTempo === 'allegro' ? "2px solid #f43f5e" : "2px solid transparent", transition: "0.2s" }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🐰</div>
              <b style={{ color: "#b91c1c", fontSize: "0.9rem", display: "block" }}>Cepat</b>
              <span style={{ color: "#fb7185", fontSize: "0.75rem" }}>Allegro</span>
            </div>
          </div>
        </div>

        {/* 🥁 SECTION 2: EKSPLORASI IRAMA */}
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a", fontSize: "1.05rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
            🥁 Eksplorasi Irama
          </h3>
          
          {/* Grid Atas (2/4 dan 3/4) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
            <div 
              onClick={() => { setActiveIrama('24'); playSound('irama', '2/4'); }}
              style={{ background: "#f5f3ff", padding: "1.2rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeIrama === '24' ? "2px solid #7c3aed" : "2px solid transparent" }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>👏👏</div>
              <b style={{ color: "#6d28d9", fontSize: "0.95rem", display: "block" }}>Birama 2/4</b>
              <span style={{ color: "#a78bfa", fontSize: "0.78rem" }}>Dua ketukan</span>
            </div>
            <div 
              onClick={() => { setActiveIrama('34'); playSound('irama', '3/4'); }}
              style={{ background: "#fdf2f8", padding: "1.2rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeIrama === '34' ? "2px solid #db2777" : "2px solid transparent" }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>👏👏👏</div>
              <b style={{ color: "#be185d", fontSize: "0.95rem", display: "block" }}>Birama 3/4</b>
              <span style={{ color: "#f472b6", fontSize: "0.78rem" }}>Tiga ketukan</span>
            </div>
          </div>

          {/* Baris Bawah (4/4 Terbentang Lebar) */}
          <div 
            onClick={() => { setActiveIrama('44'); playSound('irama', '4/4'); }}
            style={{ background: "#fffbeb", padding: "1.2rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", border: activeIrama === '44' ? "2px solid #d97706" : "2px solid transparent" }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>👏👏👏👏</div>
            <b style={{ color: "#b45309", fontSize: "0.95rem", display: "block" }}>Birama 4/4</b>
            <span style={{ color: "#fbbf24", fontSize: "0.78rem" }}>Empat ketukan (paling umum)</span>
          </div>
        </div>

        {/* 🔊 SECTION 3: EKSPLORASI DINAMIKA */}
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", padding: "1.2rem", borderRadius: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a", fontSize: "1.05rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
            🔊 Eksplorasi Dinamika
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            {/* Lembut */}
            <div 
              onClick={() => { setActiveDinamika('lembut'); playSound('dinamika', 'Lembut'); }}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1.2rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", opacity: activeDinamika && activeDinamika !== 'lembut' ? 0.6 : 1 }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "6px", color: "#94a3b8" }}>🔈</div>
              <b style={{ color: "#475569", fontSize: "0.95rem", display: "block" }}>Lembut</b>
            </div>
            {/* Keras */}
            <div 
              onClick={() => { setActiveDinamika('keras'); playSound('dinamika', 'Keras'); }}
              style={{ background: "#fff5f5", border: "1px solid #fee2e2", padding: "1.2rem 0.5rem", borderRadius: 16, textAlign: "center", cursor: "pointer", opacity: activeDinamika && activeDinamika !== 'keras' ? 0.6 : 1 }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "6px", color: "#ef4444" }}>📢</div>
              <b style={{ color: "#dc2626", fontSize: "0.95rem", display: "block" }}>Keras</b>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
// ─── 4 & 10. NAVIGASI FOOTBAR DENGAN NAMA PENYELARASAN LAYOUT (POIN 4 & 10) ───
function BottomNav({ tab, setTab }) {
  // Hanya melacak rumpun navigasi inti sesuai penataan layar mobile viewport 450px
  const items = ["home", "materi", "latihan",  "kuis", "eksplorasi", "profil"];

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0e8ff", display: "flex", zIndex: 99 }}>
      {items.map(id => {
        const isActive = tab === id;
        return (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, padding: "0.6rem 0", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: isActive ? "#7c3aed" : "#aaa", fontSize: "0.72rem", fontWeight: isActive ? 700 : 400 }}>
            <span style={{ fontSize: "1.3rem" }}>{TOOLS_CONFIG[id].icon}</span>
            {TOOLS_CONFIG[id].label}
          </button>
        );
      })}
    </div>
  );
}