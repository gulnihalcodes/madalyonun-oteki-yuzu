# Madalyonun Öteki Yüzü

**TNC Web Geliştirme / JavaScript Bitirme Projesi**

> Herkes sonucu görür. Biz hikâyeyi de.

İyi veya zorlayıcı deneyimlerin yalnızca sonucunu değil; **ne olduğunu, neden olduğunu ve ne öğrettiğini** anlatmaya odaklanan bir deneyim günlüğü ve paylaşım arayüzü.

## Kullanılan teknolojiler

- HTML5: sayfa yapısı ve semantik içerikler
- CSS3: özgün, duyarlı (responsive) görsel tasarım
- JavaScript (ES6): uygulama mantığı
- jQuery 3.7.1 (yerel dosya `assets/vendor`): etkileşimler ve DOM işlemleri
- Web Storage API (`localStorage`): kullanıcı deneyimlerini aynı tarayıcıda saklama

## TNC proje gereksinimleri

| Gereksinim | Uygulama |
| --- | --- |
| JavaScript kütüphanesi | jQuery 3.7.1 |
| CSS | Pure CSS |
| Ekle | "Deneyimini paylaş" formu |
| Listele | Deneyimler kartları, iyi/zor filtreleri |
| Güncelle | Sadece kendi deneyimlerimde "Düzenle" |
| Sil | Sadece kendi deneyimlerimde "Sil" ve onay penceresi |
| Ekran görüntüsü | `screenshots/ust-menu.png` (kullanıcının aldığı üst menü ekran görüntüsü; tam sayfa görüntüsüyle değiştirilebilir) |
| Yayın | Netlify gibi statik site barındırıcıları ile uyumlu |

## Çalıştırma

En kolay yöntem: `index.html` dosyasını tarayıcıda açmak. Daha iyi test için VS Code **Live Server** uzantısı kullanın. Terminalden: 

```bash
npx serve .
```

Açılan yerel adresi (çoğunlukla `http://localhost:3000`) tarayıcıda ziyaret edin. jQuery dosyası projeyle birlikte gelir, ayrı yükleme gerektirmez. `package.json` ayrıca kullanılan bağımlılığı listeler.

## GitHub'a yükleme

1. GitHub'da `madalyonun-oteki-yuzu` adında **Public** depo açın.
2. Bu projenin tüm dosya ve klasörlerini depoya yükleyin (ZIP dosyasının kendisi değil).
3. Repository açıklamasını: `Deneyimlerin görünen ve görünmeyen yüzünü anlatan JavaScript projesi` yapabilirsiniz.

## Netlify'da yayınlama

1. [app.netlify.com/drop](https://app.netlify.com/drop) sayfasını açın.
2. Bu proje klasörünü (ZIP içinden çıkarılmış haliyle) sürükleyip bırakın.
3. Oluşturulan `*.netlify.app` adresini açıp test edin.
4. GitHub depo adresi ve Netlify canlı bağlantısını TNC teslim formuna yapıştırın.

## Önemli sınır

Bu sürüm **sadece frontend** uygulamasıdır. Yeni deneyimler tarayıcının `localStorage` alanında tutulur; farklı kullanıcılar aynı kayıtları görmez. Dolayısıyla herkese açık bir sosyal platform / gerçek veritabanı / hesap sistemi değildir. İçerikteki ilk 6 hikâye **örnek veri**dir; gerçek kullanıcı gönderisi değildir. 

## Proje yapısı

```text
Madalyonun_Oteki_Yuzu_TNC/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   └── vendor/jquery-3.7.1.min.js, LICENSE.txt
├── screenshots/ust-menu.png
├── package.json
├── netlify.toml
└── README.md
```
