import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { FALLBACK_PRODUCTS, getProducts } from './commerce/woocommerce';
import { moneyToNumber, trackEvent } from './commerce/analytics';

const steps = [
  ['01', 'Select', 'Biji kopi dipilih berdasarkan aroma, body, dan konsistensi karakter.'],
  ['02', 'Roast', 'Profil sangrai dibangun untuk rasa penuh tanpa kehilangan detail aromatik.'],
  ['03', 'Blend', 'Kopi diracik dengan ginseng sebagai signature formula Kopi Kang Jago.'],
  ['04', 'Pack', 'Dikemas untuk menjaga kesegaran, aroma, dan pengalaman seduh yang konsisten.'],
];

const currency = (value) => `Rp${Number(value || 0).toLocaleString('id-ID')}`;

function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { getProducts().then(setProducts); }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + moneyToNumber(item.price) * item.qty, 0), [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, qty: item.qty + qty } : item)
        : [...current, { ...product, qty }];
    });
    trackEvent('add_to_cart', { content_ids: [String(product.id)], content_name: product.name, value: moneyToNumber(product.price) * qty, currency: 'IDR' });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }
    setCart((current) => current.map((item) => item.id === id ? { ...item, qty } : item));
  };

  const openProduct = (product) => {
    setSelected(product);
    trackEvent('view_product', { content_ids: [String(product.id)], content_name: product.name, value: moneyToNumber(product.price), currency: 'IDR' });
  };

  const addBundle = () => {
    const bundle = products.slice(0, 3);
    bundle.forEach((product) => addToCart(product, 1));
    setCartOpen(true);
  };

  const beginCheckout = () => {
    trackEvent('begin_checkout', {
      value: subtotal,
      currency: 'IDR',
      contents: cart.map((item) => ({ id: String(item.id), quantity: item.qty, item_price: moneyToNumber(item.price) })),
    });
    alert('Checkout foundation siap. Langkah berikutnya: sambungkan session/cart WooCommerce agar tombol ini membuka checkout WordPress live.');
  };

  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Kopi Kang Jago home"><span>KJ</span> KOPI KANG JAGO</a>
        <nav>
          <a href="#story">Cerita</a><a href="#process">Proses</a><a href="#products">Produk</a>
          <button className="navCta cartTrigger" type="button" onClick={() => setCartOpen(true)}>Keranjang · {cartCount}</button>
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

      <section id="process" className="process section"><div className="shell"><p className="eyebrow">FROM BEAN TO CUP</p><h2>Empat langkah. Satu karakter.</h2><div className="stepGrid">{steps.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

      <section className="benefits shell section">
        <div className="benefitIntro"><p className="eyebrow">WHY KANG JAGO</p><h2>Lebih dari sekadar kopi pagi.</h2><p>Positioning utama: kopi ginseng untuk ritual energi, fokus, confidence, dan momentum. Klaim spesifik seperti stamina atau performance hanya ditampilkan bila formulasi dan izin produk mendukung.</p></div>
        <div className="benefitGrid"><article><b>01</b><h3>Bold Taste</h3><p>Profil rasa tegas dan mudah dikenali.</p></article><article><b>02</b><h3>Ginseng Signature</h3><p>Diferensiasi produk yang kuat untuk komunikasi brand.</p></article><article><b>03</b><h3>Daily Energy Ritual</h3><p>Dibangun sebagai teman rutinitas aktif sehari-hari.</p></article><article><b>04</b><h3>Modern Indonesian</h3><p>Identitas lokal dengan visual dan experience premium.</p></article></div>
      </section>

      <section id="products" className="products section"><div className="shell"><div className="productHead"><div><p className="eyebrow">SHOP KANG JAGO</p><h2>Pilih jagoanmu.</h2></div><span>WooCommerce-ready catalog</span></div><div className="productGrid">{products.map((p,i)=><article className="product" key={p.id || p.name}><button className="productVisual" type="button" onClick={() => openProduct(p)}>{p.image ? <img src={p.image} alt={p.name}/> : <div className={'miniPack p'+(i%3)}><small>KOPI</small><b>KANG<br/>JAGO</b><i>GINSENG</i></div>}</button><h3>{p.name}</h3><p>{p.note} • {p.weight}</p><div><strong>{p.price}</strong><button type="button" onClick={() => addToCart(p)} aria-label={`Tambah ${p.name}`}>+</button></div></article>)}</div></div></section>

      <section className="bundle shell section">
        <div className="bundleCard">
          <div><p className="eyebrow">JAGO TRIO BUNDLE</p><h2>Tiga karakter. Satu ritual.</h2><p>Bundle discovery untuk mencoba Original, Strong, dan Reserve sekaligus. Cocok dijadikan campaign pack untuk Meta Ads.</p></div>
          <div className="bundleSide"><span className="bundleBadge">3 BOX</span><strong>Discovery Bundle</strong><button type="button" className="primary" onClick={addBundle}>Tambah Bundle</button></div>
        </div>
      </section>

      <section className="commerce shell section"><div><p className="eyebrow">COMMERCE ENGINE</p><h2>Website custom di depan.<br/>WordPress bekerja di belakang.</h2></div><div><p>Produk, harga, stok, promo, dan order dapat dikelola melalui WooCommerce. Storefront ini membaca katalog melalui WooCommerce Store API dan tetap memiliki fallback lokal bila WordPress belum tersambung.</p><div className="chips"><span>WordPress</span><span>WooCommerce</span><span>Meta Catalog</span><span>Railway</span></div></div></section>

      {selected && <div className="modalBackdrop" onClick={() => setSelected(null)}><section className="productModal productDetailModal" onClick={(e)=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="detailGrid"><div className="detailVisual">{selected.image ? <img src={selected.image} alt={selected.name}/> : <div className="detailPack"><small>KOPI</small><b>KANG<br/>JAGO</b><i>GINSENG COFFEE</i></div>}</div><div><p className="eyebrow">KOPI KANG JAGO</p><h2>{selected.name}</h2><p>{selected.note}</p><div className="tasteTags"><span>Bold</span><span>Ginseng</span><span>Daily Ritual</span></div><div className="modalFacts"><span>{selected.weight}</span><strong>{selected.price}</strong></div><button className="primary modalCta" onClick={()=>addToCart(selected)}>Tambah ke Keranjang</button><small className="detailFineprint">Detail ingredients, roast profile, origin, dan nutrition facts akan ditarik dari WooCommerce saat data final tersedia.</small></div></div></section></div>}

      <div className={`drawerBackdrop ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)}></div>
      <aside className={`cartDrawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="cartHeader"><div><p className="eyebrow">YOUR CART</p><h3>Keranjang Jago</h3></div><button type="button" onClick={() => setCartOpen(false)}>×</button></div>
        <div className="cartBody">
          {cart.length === 0 ? <div className="emptyCart"><b>Keranjang masih kosong.</b><p>Pilih jagoanmu dulu, baru kita gas ke checkout.</p></div> : cart.map((item) => <div className="cartItem" key={item.id}><div className="cartThumb">{item.image ? <img src={item.image} alt=""/> : <span>KJ</span>}</div><div className="cartItemInfo"><b>{item.name}</b><small>{item.price}</small><div className="qty"><button onClick={()=>updateQty(item.id,item.qty-1)}>−</button><span>{item.qty}</span><button onClick={()=>updateQty(item.id,item.qty+1)}>+</button></div></div><button className="remove" onClick={()=>updateQty(item.id,0)}>×</button></div>)}
        </div>
        <div className="cartFooter"><div className="subtotal"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div><button className="primary checkoutBtn" disabled={!cart.length} onClick={beginCheckout}>Lanjut Checkout</button><small>Shipping dan promo dihitung pada checkout WooCommerce.</small></div>
      </aside>

      <footer><div className="shell"><div className="brand"><span>KJ</span> KOPI KANG JAGO</div><p>Bold coffee. Strong character.</p><small>© 2026 Kopi Kang Jago. Product claims subject to final formulation and regulatory approval.</small></div></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
