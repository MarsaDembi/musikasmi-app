import { useState, useEffect} from "react";
import "././App.css";
import { db } from "/firebase"; // <-- Pastikan path import firebase.js kamu benar
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth"; // <-- Pastikan ini ada di bagian atas file App.jsx jika ditaruh satu file, atau diimpor dengan benar.
import { auth } from "/firebase";

// ─── DATA ─────────────────────────────────────────────────────────────────────

 const AVATARS = ["👩", "👨", "👧", "👦", "👱‍♀️", "👱‍♂️"];
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
function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle antara Login & Daftar
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const AVATARS = ["👩", "👨", "👧", "👦", "👱‍♀️", "👱‍♂️"]; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name.trim()) {
      alert("Nama tidak boleh kosong untuk pendaftaran baru!");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        // --- ALUR DAFTAR AKUN BARU ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const { doc, setDoc } = await import("firebase/firestore"); 
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name.trim(),
          avatarIdx: avatar, 
          email: email.trim(), // Pastikan tersimpan dengan aman
          progress: 0, 
          quizBest: 0, 
          createdAt: new Date()
        });

        alert("Akun berhasil dibuat! Otomatis masuk... 🚀");
        onLoginSuccess({ 
          uid: user.uid, 
          name: name.trim(), 
          avatarIdx: avatar, 
          progress: 0, 
          quizBest: 0,
          email: email.trim() // 🔑 DIKIRIM KE APP.JSX
        });

      } else {
        // --- ALUR MASUK (LOG IN) ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          onLoginSuccess({ 
            uid: user.uid, 
            name: userData.name, 
            avatarIdx: userData.avatarIdx ?? 0,
            progress: userData.progress !== undefined ? userData.progress : 0,
            quizBest: userData.quizBest !== undefined ? userData.quizBest : 0,
            email: userData.email || user.email // 🔑 DIKIRIM KE APP.JSX (Ambil dari Firestore atau Auth)
          });
        } else {
          // Antisipasi jika data di firestore terhapus tapi auth masih ada
          onLoginSuccess({ 
            uid: user.uid, 
            name: "User MUSIKAMI", 
            avatarIdx: 0, 
            progress: 0, 
            quizBest: 0,
            email: user.email // 🔑 DIKIRIM KE APP.JSX
          });
        }
      }
    } catch (error) {
      console.error("Autentikasi Gagal:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email sudah terdaftar! Silakan langsung login.");
      } else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        alert("Email atau password salah. Cek kembali!");
      } else {
        alert("Terjadi kesalahan: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      background: "linear-gradient(160deg,#f3e8ff 0%,#fce7f3 50%,#fff7ed 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2.5rem 1.25rem", boxSizing: "border-box"
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎵</div>
      <div style={{ fontFamily: "system-ui", fontSize: "1.8rem", fontWeight: 900, background: "linear-gradient(90deg,#7c3aed,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>MUSIKAMI</div>
      
      <div style={{ color: "#4b5563", fontSize: "0.95rem", fontWeight: "600", fontFamily: "system-ui", marginBottom: "0.5rem", textAlign: "center" }}>
        Aplikasi Unsur Musik untuk SD/MI
      </div>
      <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "2rem" }}>Audio • Multimedia • Interactive</div>
      
      <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(124,58,237,0.08)", boxSizing: "border-box" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontWeight: 700, fontSize: "1.2rem", color: "#333" }}>
          {isSignUp ? "Daftar Akun Baru" : "Selamat Datang Kembali!"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {isSignUp && (
            <>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#555", display: "block", marginBottom: "0.4rem" }}>Siapa namamu?</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ketik namamu..." disabled={isLoading} required
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#555", marginBottom: "0.6rem" }}>Pilih avatarmu:</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {AVATARS.map((a, i) => (
                    <button type="button" key={i} onClick={() => setAvatar(i)} disabled={isLoading}
                      style={{ fontSize: "1.8rem", padding: "0.4rem", borderRadius: 12, border: avatar === i ? "2.5px solid #7c3aed" : "2px solid transparent", background: avatar === i ? "#f3e8ff" : "#f9fafb", cursor: "pointer" }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: "0.85rem", color: "#555", display: "block", marginBottom: "0.4rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" disabled={isLoading} required
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "#555", display: "block", marginBottom: "0.4rem" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter..." disabled={isLoading} required minLength={6}
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={isLoading}
            style={{ width: "100%", padding: "1rem", borderRadius: 14, border: "none", background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "0.5rem" }}
          >
            {isLoading ? "Memproses... ⏳" : isSignUp ? "Mulai Belajar! 🚀" : "Masuk Aplikasi 🔓"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "#666" }}>
          {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} disabled={isLoading}
            style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
            {isSignUp ? "Masuk di sini" : "Daftar di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}
// Catatan: Baris 'export default LoginScreen;' yang ada di bawah komponen ini sudah dihapus sepenuhnya.
// HOME
function Home({ user, setTab, onOpenEksplorasi, onOpenKuis, onOpenAlatMusik }) {
  // Pengaman nilai progress agar tidak memicu NaN atau Error
  const currentProgress = user?.progress || 0;
  const totalMateri = typeof MATERI_LIST !== "undefined" ? MATERI_LIST.length : 4;
  const progress = Math.round((currentProgress / totalMateri) * 100);

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎵</div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "0.3rem 0.85rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600 }}>
            <span style={{ fontSize: "1.2rem" }}>{typeof AVATARS !== "undefined" && AVATARS[user?.avatarIdx] ? AVATARS[user.avatarIdx] : "🎵"}</span>{user?.name || "Siswa"}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ background: "#fff", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid #f0e8ff" }}>
        <span style={{ color: "#555" }}>Progres Belajar</span>
        <span style={{ color: "#7c3aed", fontWeight: 600 }}>{progress}%</span>
      </div>
      <div style={{ height: 6, background: "#f0e8ff" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 3, transition: "width 0.5s ease-out" }} />
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
          <span style={{ fontSize: "2rem" }}>🎶</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>Halo, {user?.name}! 👋</div>
            <div style={{ color: "#888", fontSize: "0.82rem" }}>Ayo belajar unsur-unsur musik hari ini!</div>
          </div>
        </div>

        {/* NAVIGATION GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {[
            { icon: "📚", title: "Materi", sub: "Pelajari unsur musik", action: () => setTab("materi") },
            { icon: "🎧", title: "Eksplorasi", sub: "Dengarkan & rasakan", action: onOpenEksplorasi },
            { icon: "✏️", title: "Latihan", sub: "Uji pemahamanmu", action: () => setTab("latihan") },
            { icon: "🏆", title: "Kuis", sub: "Evaluasi belajar", action: onOpenKuis },
          ].map((c, i) => (
            <button key={i} onClick={c.action}
              style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1.1rem", textAlign: "left", cursor: "pointer", transition: "transform 0.15s,box-shadow 0.15s", boxShadow: "0 2px 8px rgba(124,58,237,0.04)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.title}</div>
              <div style={{ color: "#aaa", fontSize: "0.75rem" }}>{c.sub}</div>
            </button>
          ))}
        </div>

        <button onClick={onOpenAlatMusik}
          style={{ background: "#fff", border: "1px solid #f0e8ff", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", width: "100%", textAlign: "left", boxShadow: "0 2px 8px rgba(124,58,237,0.04)" }}>
          <span style={{ fontSize: "1.8rem" }}>🎸</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Alat Musik</div>
            <div style={{ color: "#aaa", fontSize: "0.75rem" }}>Kenali berbagai alat musik tradisional & modern</div>
          </div>
        </button>

        {/* AKTIVITAS TERAKHIR */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1rem", boxShadow: "0 2px 8px rgba(124,58,237,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            <span>📊</span> Aktivitas Terakhir
          </div>
          {currentProgress === 0 ? (
            <div style={{ color: "#bbb", fontSize: "0.82rem", textAlign: "center", padding: "1rem 0" }}>Belum ada aktivitas. Ayo mulai belajar!</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {typeof MATERI_LIST !== "undefined" && MATERI_LIST.slice(0, currentProgress).map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", padding: "0.4rem 0", borderBottom: "1px solid #faf5ff" }}>
                  <span>{m.icon}</span><span style={{ flex: 1 }}>{m.title}</span>
                  <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 600 }}>✓ Selesai</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// HALAMAN DAFTAR MATERI
// ==========================================
// 1. HALAMAN DAFTAR MATERI (MATERIPAGE)
// ==========================================
// ==========================================
// 1. HALAMAN DAFTAR MATERI (MATERIPAGE)
// ==========================================
function MateriPage({ user, onOpenDetail }) {
  const currentProgress = user?.progress || 0;
  const daftarMateri = typeof MATERI_LIST !== "undefined" ? MATERI_LIST : [];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title="Materi Unsur Musik" sub="Pilih materi untuk dipelajari" />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {daftarMateri.map((m, i) => {
          const done = i < currentProgress;
          
          // Tombol terkunci jika urutan materi lebih besar dari progres user saat ini
          const isLocked = i > currentProgress;

          return (
            <button 
              key={m.id} 
              disabled={isLocked}
              onClick={() => onOpenDetail(m.id)}
              style={{
                background: isLocked ? "#f3f4f6" : "#fff",
                border: "none",
                borderRadius: 14,
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                cursor: isLocked ? "not-allowed" : "pointer",
                textAlign: "left",
                borderLeft: `4px solid ${isLocked ? "#d1d5db" : m.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                width: "100%",
                opacity: isLocked ? 0.6 : 1,
                transition: "all 0.2s"
              }}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: 12, 
                background: isLocked ? "#e5e7eb" : `${m.color}15`, 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: "1.5rem", flexShrink: 0 
              }}>
                {isLocked ? "🔒" : m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: isLocked ? "#9ca3af" : "#333" }}>
                  {i + 1}. {m.title}
                </div>
                <div style={{ color: isLocked ? "#cbd5e1" : "#999", fontSize: "0.78rem" }}>
                  {isLocked ? "Selesaikan materi sebelumnya terlebih dahulu" : m.sub}
                </div>
              </div>
              <span style={{ color: done ? "#22c55e" : isLocked ? "transparent" : "#ddd", fontSize: "1.1rem", fontWeight: "bold" }}>
                {done ? "✓" : "•"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. HALAMAN DETAIL MATERI (MATERIDETAIL)
// ==========================================
function MateriDetail({ id, user, onBack, onCompleteMateri }) {
  const m = MATERI_LIST.find(x => x.id === id);
  const d = MATERI_DETAIL[id];
  const idx = MATERI_LIST.findIndex(x => x.id === id);
  
  // Deteksi beres hanya berdasarkan status index materi
  const done = idx < (user?.progress || 0);

  const markDone = () => {
    // Jika materi belum beres, langsung lempar ID materi ke App.jsx tanpa mikir rumus matematika
    if (!done && onCompleteMateri) {
      onCompleteMateri(id); 
    }
    
    if (onBack) {
      onBack();
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title={d.title} sub={m.sub} onBack={onBack} />

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 10px rgba(124,58,237,0.06)" }}>
          <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "0.75rem" }}>{d.icon}</div>
          <p style={{ color: "#444", lineHeight: 1.7, fontSize: "0.92rem" }}>{d.desc}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 10px rgba(124,58,237,0.06)" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>📌 Poin Penting:</div>
          {d.poin.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.5rem", fontSize: "0.88rem", color: "#555" }}>
              <span style={{ color: "#7c3aed", fontWeight: 700, flexShrink: 0 }}>•</span>
              {p}
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg,#f3e8ff,#fce7f3)", borderRadius: 16, padding: "1.25rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>💡 Contoh:</div>
          <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.6 }}>{d.contoh}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "1rem", boxShadow: "0 2px 10px rgba(124,58,237,0.06)" }}>
          <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>🎥 Video Pembelajaran</div>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
            <iframe src={d.video} title={d.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 12 }} />
          </div>
        </div>

        <button
          onClick={markDone}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: 14,
            border: "none",
            background: done ? "#22c55e" : "linear-gradient(90deg,#7c3aed,#ec4899)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          {done ? "✓ Sudah Dipelajari (Kembali)" : "✅ Tandai Selesai & Kembali"}
        </button>
      </div>
    </div>
  );
}
// EKSPLORASI


function EksplorasiPage({ onBack }) {
  // State untuk melacak tombol mana yang sedang aktif memutar suara
  const [activeButton, setActiveButton] = useState(null);

  // Fungsi Audio Utama (Web Audio API)
  const playSound = (freq, duration = 300, volume = 0.3, buttonId = null) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = freq;
      gainNode.gain.value = volume;

      // Aktifkan warna jika ID tombol dikirim langsung (seperti di menu Dinamika)
      if (buttonId) {
        setActiveButton(buttonId);
      }

      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
        
        // Matikan warna tombol setelah durasi suara habis
        if (buttonId) {
          setActiveButton(null);
        }
      }, duration);
    } catch (e) {
      console.error(e);
    }
  };

  // Handler Suara Tempo
  const playTempo = (type) => {
    let interval = 600;
    if (type === "lambat") interval = 1000;
    if (type === "sedang") interval = 600;
    if (type === "cepat") interval = 300;

    // Nyalakan warna tombol tempo terpilih
    const id = `tempo-${type}`;
    setActiveButton(id);

    let count = 0;
    const timer = setInterval(() => {
      playSound(600, 120, 0.3);
      count++;
      
      if (count >= 4) {
        clearInterval(timer);
        // Matikan warna tepat setelah suara ketukan keempat selesai
        setTimeout(() => {
          setActiveButton(null);
        }, 120);
      }
    }, interval);
  };

  // Handler Suara Irama (Birama)
  const playIrama = (beat) => {
    let count = 0;
    let maxCount = 4;
    if (beat === "march") maxCount = 4;  // 2/4 diulang biar pas berkelanjutan
    if (beat === "waltz") maxCount = 6;  // 3/4 diulang 2x
    if (beat === "common") maxCount = 4; // 4/4 

    // Nyalakan warna tombol irama terpilih
    const id = `irama-${beat}`;
    setActiveButton(id);

    const timer = setInterval(() => {
      if (beat === "march") {
        playSound(count % 2 === 0 ? 700 : 400, 150, 0.3);
      } else if (beat === "waltz") {
        playSound(count % 3 === 0 ? 700 : 400, 150, 0.3);
      } else if (beat === "common") {
        playSound(count % 4 === 0 ? 700 : 400, 150, 0.3);
      }
      count++;
      
      if (count >= maxCount) {
        clearInterval(timer);
        // Matikan warna tepat setelah suara aksen ketukan terakhir selesai
        setTimeout(() => {
          setActiveButton(null);
        }, 150);
      }
    }, 500);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#fdf8ff", fontFamily: "system-ui, sans-serif", paddingBottom: "100px" }}>
      
      {/* HEADER UTAMA */}
      <div style={{ 
        background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", 
        padding: "1.25rem 1rem", 
        color: "#fff", 
        display: "flex", 
        alignItems: "center", 
        gap: "0.75rem",
        position: "relative"
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.25rem", cursor: "pointer", padding: 0 }}>
          ❮
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            Eksplorasi Bunyi 🎧
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.9, marginTop: "0.1rem" }}>Dengarkan dan rasakan musik</div>
        </div>
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* BANNER TIPS */}
        <div style={{ 
          background: "#fae8ff", 
          padding: "0.85rem 1rem", 
          borderRadius: 14, 
          border: "1px solid #f5d0fe",
          fontSize: "0.82rem",
          color: "#a21caf",
          lineHeight: 1.4
        }}>
          💡 <strong>Tips:</strong> Tekan tombol untuk mendengarkan contoh bunyi. Perhatikan perbedaannya!
        </div>

        {/* SECTION 1: EKSPLORASI TEMPO */}
        <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 20, boxShadow: "0 4px 20px rgba(168,85,247,0.05)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e1b4b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            ⏱️ Eksplorasi Tempo
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            {/* Lambat */}
            <button 
              onClick={() => playTempo("lambat")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "tempo-lambat" ? "#22c55e" : "#eff6ff", 
                color: activeButton === "tempo-lambat" ? "#fff" : "#1d4ed8" 
              }}
            >
              <span style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>🐢</span>
              <strong style={{ fontSize: "0.85rem" }}>Lambat</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Largo</span>
            </button>

            {/* Sedang */}
            <button 
              onClick={() => playTempo("sedang")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "tempo-sedang" ? "#22c55e" : "#ecfdf5", 
                color: activeButton === "tempo-sedang" ? "#fff" : "#047857" 
              }}
            >
              <span style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>🚶</span>
              <strong style={{ fontSize: "0.85rem" }}>Sedang</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Moderato</span>
            </button>

            {/* Cepat */}
            <button 
              onClick={() => playTempo("cepat")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "tempo-cepat" ? "#22c55e" : "#fff1f2", 
                color: activeButton === "tempo-cepat" ? "#fff" : "#b91c1c" 
              }}
            >
              <span style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>🐰</span>
              <strong style={{ fontSize: "0.85rem" }}>Cepat</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Allegro</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: EKSPLORASI IRAMA */}
        <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 20, boxShadow: "0 4px 20px rgba(168,85,247,0.05)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e1b4b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🥁 Eksplorasi Irama
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {/* Birama 2/4 */}
              <button 
                onClick={() => playIrama("march")} 
                style={{ 
                  ...cardStyle, 
                  background: activeButton === "irama-march" ? "#22c55e" : "#f5f3ff", 
                  color: activeButton === "irama-march" ? "#fff" : "#6d28d9", 
                  padding: "1rem" 
                }}
              >
                <span style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>👏👏</span>
                <strong style={{ fontSize: "0.88rem" }}>Birama 2/4</strong>
                <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Dua ketukan</span>
              </button>

              {/* Birama 3/4 */}
              <button 
                onClick={() => playIrama("waltz")} 
                style={{ 
                  ...cardStyle, 
                  background: activeButton === "irama-waltz" ? "#22c55e" : "#fdf2f8", 
                  color: activeButton === "irama-waltz" ? "#fff" : "#be185d", 
                  padding: "1rem" 
                }}
              >
                <span style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>👏👏👏</span>
                <strong style={{ fontSize: "0.88rem" }}>Birama 3/4</strong>
                <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Tiga ketukan</span>
              </button>
            </div>

            {/* Birama 4/4 */}
            <button 
              onClick={() => playIrama("common")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "irama-common" ? "#22c55e" : "#fffbeb", 
                color: activeButton === "irama-common" ? "#fff" : "#b45309", 
                padding: "1rem" 
              }}
            >
  
             <span style={{ fontSize: "1.2rem", marginBottom: "0.3rem", letterSpacing: "12px" }}>
  👏👏👏👏
</span>  <strong style={{ fontSize: "0.88rem" }}>Birama 4/4</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7, marginTop: "0.2rem" }}>Empat ketukan (paling umum)</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: EKSPLORASI DINAMIKA */}
        <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 20, boxShadow: "0 4px 20px rgba(168,85,247,0.05)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e1b4b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🔊 Eksplorasi Dinamika
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {/* Piano / Lembut */}
            <button 
              onClick={() => playSound(440, 600, 0.05, "dinamika-piano")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "dinamika-piano" ? "#22c55e" : "#f8fafc", 
                color: activeButton === "dinamika-piano" ? "#fff" : "#475569", 
                border: "1px solid #e2e8f0" 
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🔈</span>
              <strong style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Lembut</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>Piano (p)</span>
            </button>

            {/* Forte / Keras */}
            <button 
              onClick={() => playSound(440, 600, 0.6, "dinamika-forte")} 
              style={{ 
                ...cardStyle, 
                background: activeButton === "dinamika-forte" ? "#22c55e" : "#fff5f5", 
                color: activeButton === "dinamika-forte" ? "#fff" : "#e11d48", 
                border: "1px solid #fee2e2" 
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📢</span>
              <strong style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Keras</strong>
              <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>Forte (f)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Objek Style CSS Dasar Kartu Tombol
const cardStyle = {
  border: "none",
  borderRadius: 16,
  padding: "0.85rem 0.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
};

// ─── KOMPONEN HALAMAN SISA (STUB SUPAYA TIDAK ERROR CRASH) ─────────────────────
function LatihanPage({ onSelectLatihan }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#faf5ff" }}>
      <Header title="Menu Latihan Soal" sub="Uji kemampuan pemahaman teorimu" />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {LATIHAN_TYPES.map((type) => (
          <button key={type.id} onClick={() => onSelectLatihan(type.id)}
            style={{ width: "100%", padding: "1.1rem", borderRadius: 16, background: "#fff", border: "1px solid #f0e8ff", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: "2rem" }}>{type.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{type.title}</div>
              <div style={{ color: "#aaa", fontSize: "0.78rem" }}>{type.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LatihanSoal({ type, onBack }) {
  const soalList = LATIHAN_SOAL[type] || [];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAns = (idx) => {
    if (idx === soalList[current].ans) setScore(score + 1);
    const next = current + 1;
    if (next < soalList.length) setCurrent(next);
    else setShowScore(true);
  };

  return (
    <div style={{ flex: 1, background: "#faf5ff" }}>
      <Header title={`Sesi Latihan: ${type}`} sub="Jawablah dengan benar" onBack={onBack} />
      <div style={{ padding: "1rem" }}>
        {showScore ? (
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 16, textAlign: "center" }}>
            <h2>🎉 Latihan Selesai!</h2>
            <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>Skor Kamu: <strong>{Math.round((score / soalList.length) * 100)}</strong></p>
            <button onClick={onBack} style={{ padding: "0.75rem 1.5rem", borderRadius: 12, border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer" }}>Kembali</button>
          </div>
        ) : (
          soalList.length > 0 && (
            <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 16 }}>
              <div style={{ fontSize: "0.8rem", color: "#999", marginBottom: "0.5rem" }}>Pertanyaan {current + 1} dari {soalList.length}</div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem" }}>{soalList[current].q}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {soalList[current].opts.map((opt, i) => (
                  <button key={i} onClick={() => handleAns(i)} style={{ width: "100%", padding: "0.85rem", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", textAlign: "left", cursor: "pointer" }}>{opt}</button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function KuisIntro({ onBack, user, onSaveQuizScore }) {
  // State manajemen alur kuis
  const [statusKuis, setStatusKuis] = useState("intro"); // intro, bermain, selesai
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawabanTerpilih, setJawabanTerpilih] = useState(null);
  const [skorMurni, setSkorMurni] = useState(0);

  const soalAktif = QUIZ_QUESTIONS[indeksSoal];

  const mulaiKuisBaru = () => {
    setIndeksSoal(0);
    setSkorMurni(0);
    setJawabanTerpilih(null);
    setStatusKuis("bermain");
  };

  const handlePilihJawaban = (indeksOpsi) => {
    if (jawabanTerpilih !== null) return;
    setJawabanTerpilih(indeksOpsi);

    // Cek jawaban menggunakan properti .ans dari data kamu
    if (indeksOpsi === soalAktif.ans) {
      setSkorMurni((prev) => prev + 1);
    }

    // Jeda 1.2 detik sebelum pindah soal agar user melihat feedback warna
    setTimeout(() => {
      if (indeksSoal + 1 < QUIZ_QUESTIONS.length) {
        setIndeksSoal((prev) => prev + 1);
        setJawabanTerpilih(null);
      } else {
        // Hitung total skor akhir dengan skala 0 - 100
        const totalJawabanBenar = skorMurni + (indeksOpsi === soalAktif.ans ? 1 : 0);
        const skorAkhir = Math.round((totalJawabanBenar / QUIZ_QUESTIONS.length) * 100);
        
        // Simpan langsung ke Firebase
        if (onSaveQuizScore) {
          onSaveQuizScore(skorAkhir);
        }
        setStatusKuis("selesai");
      }
    }, 1200);
  };

  // --- LAYAR 1: INTRO UTAMA ---
  if (statusKuis === "intro") {
    return (
      <div style={{ padding: "1rem" }}>
        <Header title="Evaluasi Kuis Besar" sub="Uji materi gabungan menyeluruh" onBack={onBack} />
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 16, marginTop: "1rem", textAlign: "center", boxShadow: "0 2px 10px rgba(124,58,237,0.06)" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>🏆 Ruang Kuis Utama</h3>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>
            Nilai Tertinggi Kamu Saat Ini: <strong style={{ color: "#ec4899", fontSize: "1.1rem" }}>{user?.quizBest || 0}</strong>
          </p>
          <button onClick={mulaiKuisBaru} style={{ width: "100%", padding: "1rem", borderRadius: 12, background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
            Mulai Kuis 🚀
          </button>
        </div>
      </div>
    );
  }

  // --- LAYAR 2: PROSES MENJAWAB ---
  if (statusKuis === "bermain") {
    return (
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", fontFamily: "system-ui" }}>
          <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 600 }}>Soal {indeksSoal + 1} dari {QUIZ_QUESTIONS.length}</span>
          <span style={{ fontSize: "0.85rem", background: "#f3e8ff", color: "#7c3aed", padding: "4px 10px", borderRadius: 20, fontWeight: "bold" }}>Benar: {skorMurni}</span>
        </div>

        {/* Kotak Pertanyaan (Properti .q) */}
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 16, marginBottom: "1rem", boxShadow: "0 2px 10px rgba(124,58,237,0.04)" }}>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "#333", lineHeight: 1.5, margin: 0 }}>{soalAktif.q}</p>
        </div>

        {/* Pilihan Jawaban (Properti .opts) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {soalAktif.opts.map((opsi, indeks) => {
            let warnaBackground = "#fff";
            let warnaBorder = "1.5px solid #e5e7eb";
            let warnaTeks = "#333";

            if (jawabanTerpilih !== null) {
              if (indeks === soalAktif.ans) {
                warnaBackground = "#dcfce7"; // Hijau jika benar
                warnaBorder = "1.5px solid #22c55e";
                warnaTeks = "#15803d";
              } else if (jawabanTerpilih === indeks) {
                warnaBackground = "#fee2e2"; // Merah jika pilihan user salah
                warnaBorder = "1.5px solid #ef4444";
                warnaTeks = "#b91c1c";
              }
            }

            return (
              <button
                key={indeks}
                onClick={() => handlePilihJawaban(indeks)}
                disabled={jawabanTerpilih !== null}
                style={{
                  width: "100%", padding: "1rem", textAlign: "left", background: warnaBackground,
                  border: warnaBorder, borderRadius: 12, fontSize: "0.9rem", color: warnaTeks,
                  fontWeight: 500, cursor: jawabanTerpilih !== null ? "default" : "pointer",
                  transition: "all 0.2s ease", boxSizing: "border-box"
                }}
              >
                {opsi}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- LAYAR 3: HASIL SKOR AKHIR ---
  if (statusKuis === "selesai") {
    const nilaiFinal = Math.round((skorMurni / QUIZ_QUESTIONS.length) * 100);
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <div style={{ background: "#fff", padding: "2rem 1.5rem", borderRadius: 16, boxShadow: "0 4px 20px rgba(124,58,237,0.08)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🎉</div>
          <h3 style={{ color: "#333", marginBottom: "0.25rem" }}>Kuis Selesai!</h3>
          <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Hasil evaluasi pemahaman teori musik kamu</p>
          
          <div style={{ background: "#f9fafb", padding: "1.25rem", borderRadius: 16, marginBottom: "2rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#666", display: "block", marginBottom: "0.25rem" }}>Nilai Akhir</span>
            <span style={{ fontSize: "3.3rem", fontWeight: 900, color: nilaiFinal >= 70 ? "#22c55e" : "#7c3aed" }}>{nilaiFinal}</span>
            <span style={{ fontSize: "0.85rem", color: "#888", display: "block", marginTop: "0.5rem" }}>Menjawab benar {skorMurni} dari {QUIZ_QUESTIONS.length} soal</span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={mulaiKuisBaru} style={{ flex: 1, padding: "0.85rem", borderRadius: 12, border: "1.5px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, cursor: "pointer" }}>
              Ulangi Kuis 🔄
            </button>
            <button onClick={onBack} style={{ flex: 1, padding: "0.85rem", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              Keluar Kuis
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function AlatMusikPage({ onBack }) {
  return (
    <div style={{ padding: "1rem" }}>
      <Header title="Galeri Alat Musik" sub="Kenali Ragam Jenis Alat Musik" onBack={onBack} />
      <h3 style={{ margin: "1rem 0 0.5rem" }}>Tradisional 🎋</h3>
      {ALAT_TRADISIONAL.slice(0, 2).map((a, i) => (
        <div key={i} style={{ background: a.bg, padding: "1rem", borderRadius: 14, marginBottom: "0.5rem" }}><strong>{a.icon} {a.name}</strong> ({a.asal}) - {a.deskripsi}</div>
      ))}
      <h3 style={{ margin: "1rem 0 0.5rem" }}>Modern 🎸</h3>
      {ALAT_MODERN.slice(0, 2).map((a, i) => (
        <div key={i} style={{ background: a.bg, padding: "1rem", borderRadius: 14, marginBottom: "0.5rem" }}><strong>{a.icon} {a.name}</strong> - {a.deskripsi}</div>
      ))}
    </div>
  );
}

// 1. SESUAIKAN ANGKA INI: Ubah ke total seluruh materi yang ada di aplikasi MUSIKAMI kamu
const TOTAL_MATERI_MUSIKAMI = 6; 

function ProfilPage({ user, onLogout }) {
 // Hitung jumlah materi selesai dan persentase bar secara otomatis
  const materiSelesai = user?.progress || 0;
  const persentaseBelajar = Math.min(
    Math.round((materiSelesai / TOTAL_MATERI_MUSIKAMI) * 100), 
    100
  );

  return (
    <div style={{ flex: 1, background: "#faf5ff", fontFamily: "system-ui", paddingBottom: "100px" }}>
      {/* Tetap mempertahankan komponen Header bawaan kamu */}
      <Header title="Profil Akun" sub="Detail informasi belajar Anda" />
      
      <div style={{ padding: "1rem", textAlign: "center" }}>
        {/* AVATAR MANUSIA (SINKRON DENGAN DATA LOGIN) */}
        <div style={{ 
          fontSize: "4rem", 
          background: "#f3e8ff", 
          width: "100px", 
          height: "100px", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 1rem auto",
          boxShadow: "0 4px 12px rgba(124,58,237,0.1)"
        }}>
          {AVATARS[user?.avatarIdx] ? AVATARS[user.avatarIdx] : "👤"}
        </div>
        
        <h2 style={{ margin: "0 0 0.25rem 0", color: "#333", fontWeight: 700 }}>
          {user?.name || "Siswa MUSIKAMI"}
        </h2>
        <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 1.5rem 0" }}>Status Belajar: Level SD/MI</p>

        {/* 2. BOX PROGRES BELAJAR BARU */}
        <div 
          style={{ 
            background: "#fff", 
            padding: "1.25rem", 
            borderRadius: 16, 
            textAlign: "left",
            boxShadow: "0 2px 10px rgba(124,58,237,0.05)",
            marginBottom: "1rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 700, color: "#333", fontSize: "0.9rem" }}>📊 Progres Kelulusan Materi</span>
            <span style={{ fontWeight: 800, color: "#7c3aed", fontSize: "1rem" }}>{persentaseBelajar}%</span>
          </div>

          {/* Bar Progress Track */}
          <div style={{ width: "100%", height: 10, background: "#f3e8ff", borderRadius: 8, overflow: "hidden", marginBottom: "0.5rem" }}>
            {/* Isian Warna Bar Progress */}
            <div 
              style={{ 
                width: `${persentaseBelajar}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #7c3aed, #ec4899)", 
                borderRadius: 8,
                transition: "width 0.5s ease-out"
              }} 
            />
          </div>

          <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
            Kamu telah menyelesaikan <strong>{materiSelesai}</strong> dari <strong>{TOTAL_MATERI_MUSIKAMI}</strong> materi.
          </p>
        </div>

        {/* 3. BOX STATISTIK KUIS BARU */}
        <div 
          style={{ 
            background: "#fff", 
            padding: "1rem", 
            borderRadius: 16, 
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(124,58,237,0.05)",
            marginBottom: "1.5rem"
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginBottom: "0.25rem" }}>🏆 Nilai Kuis Tertinggi</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ec4899" }}>{user?.quizBest || 0}</span>
        </div>

        {/* Tombol Keluar bawaan kamu */}
        <button 
          onClick={onLogout} 
          style={{ 
            width: "100%", 
            padding: "0.85rem", 
            borderRadius: 12, 
            background: "#ef4444", 
            color: "#fff", 
            border: "none", 
            fontWeight: 700, 
            cursor: "pointer",
            transition: "background 0.2s" 
          }}
        >
          Keluar Akun 🚪
        </button>
      </div>
    </div>
  );
}


// Pastikan db sudah diimport dari konfigurasi firebase kamu di atas
// import { db } from "./firebaseConfig"; 
function AdminDashboard({ onLogout }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Jumlah total materi asli
  const TOTAL_MATERI = 6; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email !== "admin@musikami.com") {
            usersData.push({ id: doc.id, ...data });
          }
        });
        
        setUsersList(usersData);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* TOP NAVIGATION BAR */}
      <header style={{ 
        background: "#ffffff", 
        padding: "1rem 2.5rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#4f46e5", color: "#fff", padding: "8px 12px", borderRadius: "10px", fontWeight: 800, fontSize: "1.1rem" }}>M</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em" }}>Dashboard Admin</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>Aplikasi Pembelajaran Mandiri MUSIKAMI</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout} 
          style={{ 
            background: "#fff", 
            color: "#0f172a", 
            border: "1px solid #e2e8f0", 
            padding: "0.5rem 1.2rem", 
            borderRadius: 8, 
            fontWeight: 600, 
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.15s ease-in-out"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#f8fafc";
            e.target.style.borderColor = "#cbd5e1";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#fff";
            e.target.style.borderColor = "#e2e8f0";
          }}
        >
          Keluar Ke Sistem
        </button>
      </header>

      {/* KONTEN UTAMA */}
      <main style={{ padding: "2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* SECTION HEADER DATA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em" }}>Ringkasan Progres Pengguna</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.875rem", color: "#64748b" }}>Data analitik tingkat penyelesaian bab materi dan performa kuis terbaik siswa.</p>
          </div>
          <div style={{ background: "#e0e7ff", color: "#4338ca", padding: "6px 14px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600 }}>
            {usersList.length} Siswa Terdaftar
          </div>
        </div>
        
        {/* DATA CONTAINER */}
        <div style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "#64748b" }}>
              <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>⏳</span>
              <p style={{ fontSize: "0.95rem", fontWeight: 500 }}>Sinkronisasi basis data pengguna sedang berlangsung...</p>
            </div>
          ) : usersList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "#94a3b8" }}>
              <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>📁</span>
              <p style={{ fontSize: "0.95rem" }}>Belum ada rekaman entri data pengguna aktif ditemukan.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 600 }}>
                    <th style={{ padding: "0.85rem 1.5rem" }}>Identitas Siswa</th>
                    <th style={{ padding: "0.85rem 1.5rem" }}>Alamat Email</th>
                    <th style={{ padding: "0.85rem 1.5rem" }}>Penyelesaian Bab</th>
                    <th style={{ padding: "0.85rem 1.5rem" }}>Metrik Progres</th>
                    <th style={{ padding: "0.85rem 1.5rem", textAlign: "center" }}>Skor Kuis Tertinggi</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const selesai = u.progress || 0;
                    const persen = Math.min(Math.round((selesai / TOTAL_MATERI) * 100), 100);
                    const AVATARS_LIST = ["👩", "👨", "👧", "👦", "👱‍♀️", "👱‍♂️"];

                    return (
                      <tr 
                        key={u.id} 
                        style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }} 
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} 
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        {/* NAMA */}
                        <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "1.2rem", filter: "grayscale(10%)" }}>
                            {AVATARS_LIST[u.avatarIdx] || "👤"}
                          </span>
                          {u.name}
                        </td>
                        
                        {/* EMAIL */}
                        <td style={{ padding: "1rem 1.5rem", color: "#475569", fontFamily: "monospace", fontSize: "0.85rem" }}>
                          {u.email || "-"}
                        </td>
                        
                        {/* CAPAIAN MATERI */}
                        <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "#334155" }}>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
                            {selesai} dari {TOTAL_MATERI} Bab
                          </span>
                        </td>
                        
                        {/* PROGRESS BAR BARU */}
                        <td style={{ padding: "1rem 1.5rem", width: "240px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 9999, overflow: "hidden" }}>
                              <div style={{ 
                                width: `${persen}%`, 
                                height: "100%", 
                                background: persen === 100 ? "#10b981" : "#4f46e5", 
                                borderRadius: 9999 
                              }} />
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0f172a", width: "35px", textAlign: "right" }}>
                              {persen}%
                            </span>
                          </div>
                        </td>
                        
                        {/* SKOR KUIS */}
                        <td style={{ padding: "1rem 1.5rem", textAlign: "center", fontWeight: 700, color: u.quizBest >= 80 ? "#16a34a" : "#0f172a" }}>
                          <span style={{ fontSize: "1rem" }}>{u.quizBest || 0}</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 400 }}> / 100</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



//function HomeStub({ user }) { return <div>Home</div>; }
//function BottomNavStub() { return <div>Nav</div>; }

// ─── KOMPONEN UTAMA UTAMA: APP (HANYA ADA SATU EXPORT DEFAULT DI SINI) ──────────
export default function App() {
  const [user, setUser] = useState(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true); // Cek status login di awal
  const [screen, setScreen] = useState("login"); 
  const [tab, setTab] = useState("home");        
  const [materiActiveId, setMateriActiveId] = useState(null); 
  const [latihanActiveId, setLatihanActiveId] = useState(null);

  // 1. MEMANTAU STATUS LOGIN USER (Firebase Auth Listener)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        const { doc, getDoc } = await import("firebase/firestore");

        // Memanggil 'auth' global bawaan project
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const dbData = docSnap.data();
              const userData = { 
                id: firebaseUser.uid, 
                uid: firebaseUser.uid,
                name: dbData.name || "Siswa MUSIKAMI", 
                avatarIdx: dbData.avatarIdx !== undefined ? dbData.avatarIdx : 0, 
                progress: dbData.progress !== undefined ? dbData.progress : 0,
                quizBest: dbData.quizBest !== undefined ? dbData.quizBest : 0,
                email: dbData.email || firebaseUser.email
              };

              setUser(userData);

              // 🛡️ CEK EMAIL ADMIN: Mengarahkan layar ke dashboard admin jika email cocok
              if (firebaseUser.email === "admin@musikami.com") {
                setScreen("admin");
              } else {
                setScreen("main");
              }

            } else {
              // Jika data user baru belum ada di Firestore, set default parameter secara lengkap
              const defaultData = { id: firebaseUser.uid, uid: firebaseUser.uid, name: "User MUSIKAMI", avatarIdx: 0, progress: 0, quizBest: 0, email: firebaseUser.email };
              setUser(defaultData);
              
              if (firebaseUser.email === "admin@musikami.com") {
                setScreen("admin");
              } else {
                setScreen("main");
              }
            }
          } else {
            setUser(null);
            setScreen("login");
          }
          setIsLoadingProfiles(false);
        });
      } catch (err) {
        console.error("Gagal memuat sistem autentikasi:", err);
        setIsLoadingProfiles(false);
      }
    };

    initAuth();
  }, []);

  // 2. MENANGANI LOGOUT
  const handleLogout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      
      await signOut(auth);
      setUser(null);
      setScreen("login");
      setTab("home");
      setMateriActiveId(null);
      setLatihanActiveId(null);
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

  // 3. FUNGSI UNTUK UPDATE DATA & PROGRES KE FIRESTORE
  const updateUserProgress = async (updatedData) => {
    if (!user || !user.id) return;

    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const userDocRef = doc(db, "users", user.id);

      // Update ke database Firebase Firestore
      await updateDoc(userDocRef, updatedData);

      // Update state React lokal agar UI langsung berubah secara realtime tanpa reload
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      console.log("Data berhasil disimpan ke Firestore!");
    } catch (error) {
      console.error("Gagal menyimpan data ke Firestore:", error);
    }
  };

  // TAMPILAN JIKA SEDANG MEMERIKSA STATUS LOGIN
  if (isLoadingProfiles) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#f3e8ff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", fontFamily: "system-ui", color: "#7c3aed" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>Memuat profil MUSIKAMI... ⏳</p>
        </div>
      </div>
    );
  }

  // TAMPILAN LAYAR LOGIN / DAFTAR
  if (screen === "login") {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#f3e8ff", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "450px" }}>
          <LoginScreen 
            onLoginSuccess={(userData) => {
              setUser(userData);
              if (userData.email === "admin@musikami.com") {
                setScreen("admin");
              } else {
                setScreen("main");
                setTab("home");
              }
            }} 
          />
        </div>
      </div>
    );
  }

  // TAMPILAN LAYAR ADMIN DASHBOARD
  if (screen === "admin") {
    return (
      <AdminDashboard onLogout={handleLogout} />
    );
  }

  // TAMPILAN UTAMA APLIKASI (SETELAH LOGIN - SEBAGAI SISWA)
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f3e8ff", display: "flex", justifyContent: "center", alignItems: "flex-start", overflowY: "auto", padding: "20px 0" }}>
      <div style={{ 
        width: "100%", maxWidth: tab === "home" ? "1200px" : "450px", minHeight: "calc(100vh - 40px)", 
        display: "flex", flexDirection: "column", background: "#fff", boxShadow: "0 10px 30px rgba(124, 58, 237, 0.15)", 
        borderRadius: "20px", position: "relative", overflow: "visible", transition: "max-width 0.3s ease",
        paddingBottom: !materiActiveId && !latihanActiveId && ["home", "materi", "latihan", "profil"].includes(tab) ? "90px" : "20px"
      }}>
        <div style={{ flex: 1, width: "100%" }}>
          
          {/* TAB HOME */}
          {tab === "home" && (
            <Home 
              user={user} 
              setTab={setTab} 
              onOpenEksplorasi={() => setTab("eksplorasi")} 
              onOpenKuis={() => setTab("kuis")} 
              onOpenAlatMusik={() => setTab("alatmusik")} 
            />
          )}
          
          {/* TAB MATERI */}
          {tab === "materi" && (
            materiActiveId ? (
              <MateriDetail 
                id={materiActiveId} 
                user={user} 
                onBack={() => setMateriActiveId(null)} 
                onCompleteMateri={(materiId) => {
                  // 1. Ambil data indeks asli materi berdasarkan ID string yang dikirim
                  const idx = typeof MATERI_LIST !== "undefined" ? MATERI_LIST.findIndex(x => x.id === materiId) : -1;
                  const currentProgress = user?.progress || 0;

                  // 2. Cek validasi: Hanya simpan jika murid menyelesaikan materi yang tepat sesuai urutan belajarnya
                  if (idx !== -1 && idx === currentProgress) {
                    const totalMateri = typeof MATERI_LIST !== "undefined" ? MATERI_LIST.length : 4;
                    
                    // 🛡️ LIMITER AMAN: Progres baru ditambahkan 1, tapi tidak boleh menembus total panjang materi
                    const progresAman = Math.min(currentProgress + 1, totalMateri);
                    
                    // Simpan hasil kalkulasi mutlak ke Firestore
                    updateUserProgress({ progress: progresAman });
                  }
                }}
              />
            ) : (
              <MateriPage user={user} onOpenDetail={(id) => setMateriActiveId(id)} />
            )
          )}
          
          {/* TAB LATIHAN */}
          {tab === "latihan" && (
            latihanActiveId ? (
              <LatihanSoal type={latihanActiveId} onBack={() => setLatihanActiveId(null)} />
            ) : (
              <LatihanPage onSelectLatihan={(id) => setLatihanActiveId(id)} />
            )
          )}
          
          {/* TAB PROFIL */}
          {tab === "profil" && <ProfilPage user={user} onLogout={handleLogout} />}
          
          {/* TAB EKSPLORASI */}
          {tab === "eksplorasi" && <EksplorasiPage onBack={() => setTab("home")} />}
          
          {/* TAB KUIS */}
          {tab === "kuis" && (
            <KuisIntro 
              onBack={() => setTab("home")} 
              user={user} 
              onSaveQuizScore={(scoreBaru) => {
                const skorLama = user?.quizBest || 0;
                if (scoreBaru > skorLama) {
                  updateUserProgress({ quizBest: scoreBaru });
                }
              }}
            />
          )}
          
          {/* TAB ALAT MUSIK */}
          {tab === "alatmusik" && <AlatMusikPage onBack={() => setTab("home")} />}
        </div>

        {/* Navigasi Bottom Bar selalu muncul di setiap page */}
        {["home", "materi", "latihan", "profil", "eksplorasi", "kuis", "alatmusik"].includes(tab) && (
          <div style={{ position: "fixed", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}>
            <div style={{ width: "100%", maxWidth: tab === "home" ? "1200px" : "450px", padding: "0 20px", boxSizing: "border-box" }}>
              <BottomNav tab={tab} setTab={setTab} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}