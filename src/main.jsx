import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const products = [
  { name: 'Jago Original', note: 'Kopi ginseng signature', weight: '10 sachet', price: 'Rp89.000' },
  { name: 'Jago Strong', note: 'Roast lebih bold', weight: '10 sachet', price: 'Rp99.000' },
  { name: 'Jago Reserve', note: 'Blend premium pilihan', weight: '10 sachet', price: 'Rp119.000' },
];

const steps = [
  ['01', 'Select', 'Biji kopi dipilih berdasarkan aroma, body, dan konsistensi karakter.'],
  ['02', 'Roast', 'Profil sangrai dibangun untuk rasa penuh tanpa kehilangan detail aromatik.'],
  ['03', 'Blend', 'Kopi diracik dengan ginseng sebagai signature formula Kopi Kang Jago.'],
  ['04', 'Pack', 'Dikemas untuk menjaga kesegaran, aroma, dan pengalaman seduh yang konsisten.'],
];

function App() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Kopi Kang Jago home"><span>KJ</span> KOPI KANG JAGO</a>
        <nav>
          <a href="#story">Cerita</a><a href="#process">Proses</a><a href="#products">Produk</a>
          <a className="navCta" href="#products">Belanja</a>
        </nav>
      </header>

      <section id="top" className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">COFFEE WITH CHARACTER • GINSENG SIGNATURE</p>
          <h1>Kopi yang datang<br/>dengan <em>tenaga karakter.</em></h1>
          <p className="lead">Kopi Kang Jago menggabungkan karakter kopi Indonesia yang tegas dengan signature ginseng dalam pengalaman minum yang modern, maskulin, dan premium.</p>
          <div className="actions"><a className="primary" href="#products">Lihat Produk</a><a className="ghost" href="#story">Kenal Lebih Dekat</a></div>
          <p className="fineprint">*Komunikasi manfaat produk akan disesuaikan dengan komposisi, bukti pendukung, dan ketentuan klaim yang berlaku.</p>
        </div>
        <div className="heroVisual" aria-label="Kopi Kang Jago product concept">
          <div className="sun"></div><div className="grain grain1"></div><div className="grain grain2"></div>
          <div className="pack"><small>KOPI</small><strong>KANG<br/>JAGO</strong><b>GINSENG COFFEE</b><span>STRONG CHARACTER<br/>BOLD COFFEE</span></div>
          <div className="cup"><i></i></div>
        </div>
      </section>

      <section className="ticker"><span>INDONESIAN COFFEE</span><b>✦</b><span>GINSENG SIGNATURE</span><b>✦</b><span>BOLD CHARACTER</span><b>✦</b><span>DAILY RITUAL</span></section>

      <section id="story" className="story shell section">
        <div><p className="eyebrow">OUR STORY</p><h2>Dari tanah, jadi karakter.</h2></div>
        <div className="storyText"><p>Kopi Kang Jago dibangun dari ide sederhana: kopi harian tidak harus terasa biasa. Kami ingin setiap cangkir punya cerita tentang asal, proses, dan karakter yang mudah dikenali.</p><p>Perjalanan brand dimulai dari eksplorasi kopi Indonesia, hubungan antara terroir dan profil rasa, lalu dikembangkan menjadi format kopi ginseng yang relevan untuk ritme hidup modern.</p></div>
      </section>

      <section className="plantation shell section">
        <div className="photoCard"><div className="mountains"></div><span>ORIGIN / INDONESIA</span></div>
        <div className="infoCard"><p className="eyebrow">PLANTATION</p><h2>Berawal dari kebun yang tepat.</h2><p>Halaman origin akan menampilkan lokasi perkebunan aktual, elevasi, varietas, musim panen, serta mitra petani setelah data supply chain final tersedia.</p><div className="facts"><div><b>Arabica / Robusta</b><span>Blend dapat disesuaikan SKU</span></div><div><b>Traceable Origin</b><span>Story per wilayah & lot</span></div><div><b>Quality Selection</b><span>Sortasi & roast profile</span></div></div></div>
      </section>

      <section id="process" className="process section">
        <div className="shell"><p className="eyebrow">FROM BEAN TO CUP</p><h2>Empat langkah. Satu karakter.</h2><div className="stepGrid">{steps.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div>
      </section>

      <section className="benefits shell section">
        <div className="benefitIntro"><p className="eyebrow">WHY KANG JAGO</p><h2>Lebih dari sekadar kopi pagi.</h2><p>Positioning utama: kopi ginseng untuk ritual energi, fokus, confidence, dan momentum. Klaim spesifik seperti stamina atau performance hanya ditampilkan bila formulasi dan izin produk mendukung.</p></div>
        <div className="benefitGrid"><article><b>01</b><h3>Bold Taste</h3><p>Profil rasa tegas dan mudah dikenali.</p></article><article><b>02</b><h3>Ginseng Signature</h3><p>Diferensiasi produk yang kuat untuk komunikasi brand.</p></article><article><b>03</b><h3>Daily Energy Ritual</h3><p>Dibangun sebagai teman rutinitas aktif sehari-hari.</p></article><article><b>04</b><h3>Modern Indonesian</h3><p>Identitas lokal dengan visual dan experience premium.</p></article></div>
      </section>

      <section id="products" className="products section"><div className="shell"><div className="productHead"><div><p className="eyebrow">SHOP KANG JAGO</p><h2>Pilih jagoanmu.</h2></div><span>WooCommerce-ready catalog</span></div><div className="productGrid">{products.map((p,i)=><article className="product" key={p.name}><div className={'miniPack p'+i}><small>KOPI</small><b>KANG<br/>JAGO</b><i>GINSENG</i></div><h3>{p.name}</h3><p>{p.note} • {p.weight}</p><div><strong>{p.price}</strong><button type="button">+</button></div></article>)}</div></div></section>

      <section className="commerce shell section"><div><p className="eyebrow">COMMERCE ENGINE</p><h2>Website custom di depan.<br/>WordPress bekerja di belakang.</h2></div><div><p>Produk, harga, stok, promo, dan order dapat dikelola melalui WooCommerce. Storefront ini kemudian membaca katalog melalui WooCommerce Store API / REST API, sementara Meta for WooCommerce dapat menangani sinkronisasi katalog untuk ekosistem Meta.</p><div className="chips"><span>WordPress</span><span>WooCommerce</span><span>Meta Catalog</span><span>Railway</span></div></div></section>

      <footer><div className="shell"><div className="brand"><span>KJ</span> KOPI KANG JAGO</div><p>Bold coffee. Strong character.</p><small>© 2026 Kopi Kang Jago. Product claims subject to final formulation and regulatory approval.</small></div></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
