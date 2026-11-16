/* Madalyonun Öteki Yüzü — TNC JavaScript bitirme projesi.
 * jQuery 3.7.1 ve localStorage kullanır. Yalnızca kullanıcıya ait veriler düzenlenebilir.
 */
(function ($) {
  'use strict';

  const sampleStories = [
    {title:'İş görüşmesinde elendim. Asıl sorun neydi?',category:'Kariyer',outcome:'hard',what:'Bir iş görüşmesine girdim ama olumlu dönüş alamadım. Sonuç beni hayal kırıklığına uğrattı.',why:'Görüşme öncesinde şirketi yeterince araştırmamış, projelerimi somut örneklerle anlatmaya hazırlanmamıştım.',lesson:'Sadece bilgi sahibi olmak yetmiyor; kendimi ve yaptıklarımı anlatmayı da öğrenmem gerekiyor.'},
    {title:'Küçük bir çalışma planı büyük fark yarattı.',category:'Eğitim',outcome:'good',what:'Uzun süredir zorlandığım bir sınava, önceki dönemlere göre daha hazırlıklı girdim.',why:'Son güne bırakmak yerine konuları küçük parçalara böldüm ve kendi notlarımı çıkardım.',lesson:'Benim için en iyi yöntem, düzenli tekrar ve yazarak çalışmakmış.'},
    {title:'Yeni bir şehre alışmak düşündüğümden zordu.',category:'Günlük hayat',outcome:'hard',what:'Yeni bir şehre taşındığımda ilk haftalar kendimi yalnız ve kararsız hissettim.',why:'Her şeyi hemen düzene sokmam gerektiğini düşündüm ve çevremi tanımaya zaman ayırmadım.',lesson:'Alışmak zaman alıyor. Küçük rutinler ve insanlarla iletişim kurmak bana iyi geldi.'},
    {title:'Birine yardım etmek bana da iyi geldi.',category:'Kişisel gelişim',outcome:'good',what:'Bir gönüllülük etkinliğine katılıp daha önce tanımadığım insanlarla birlikte çalıştım.',why:'Küçük bir adım atıp katılmaya karar verdim; ortak amaç iletişimi kolaylaştırdı.',lesson:'Katılmak için her şeyi önceden bilmem gerekmiyormuş; bazen sadece orada olmak yeterli.'},
    {title:'Grup projemiz neden yetişmedi?',category:'Eğitim',outcome:'hard',what:'Ekip olarak çok emek verdiğimiz bir projeyi son gün aceleyle tamamladık.',why:'Görevleri baştan netleştirmedik ve herkesin ne yaptığını düzenli kontrol etmedik.',lesson:'İyi fikir kadar görev paylaşımı, ara kontrol ve iletişim de önemli.'},
    {title:'Hayır demek düşündüğüm kadar kötü olmadı.',category:'Kişisel gelişim',outcome:'good',what:'Zamanımın yetmediği bir sorumluluğu nazikçe reddettim.',why:'İlk defa kapasitemi açıkça anlattım ve alternatif bir zaman önerdim.',lesson:'Sınır koymak insanları önemsememek değil; yapabileceğim şeyi dürüstçe söylemek.'}
  ];
  const showcase = [
    {category:'Kariyer',frontTitle:'İş görüşmesinden olumsuz dönüş aldım.',frontText:'Herkes sadece sonucu gördü: Bu kez işe alınmadım.',backTitle:'Asıl sorun hazırlığımdı.',backText:'Şirketi daha iyi araştırmam, kendi projelerimi örneklerle anlatmam gerektiğini fark ettim.',tag:'Zorlayıcı ama öğretici'},
    {category:'Eğitim',frontTitle:'Bu sınavda beklediğimden iyi yaptım.',frontText:'Dışarıdan bakınca sadece yüksek bir not görünüyor.',backTitle:'Küçük tekrarlar işe yaradı.',backText:'Konuyu küçük parçalara ayırmak ve yazarak çalışmak fark yarattı. Şans değildi; yöntemdi.',tag:'İyi giden bir deneyim'},
    {category:'Günlük hayat',frontTitle:'Yeni şehre alışmakta zorlandım.',frontText:'Görünen sadece sessiz, içine kapanmış birkaç hafta.',backTitle:'Kendime zaman tanımam gerekiyordu.',backText:'Küçük rutinler kurup insanlarla tanışmaya başladığımda her şey yavaş yavaş değişti.',tag:'Bir öğrenme süreci'}
  ];
  const STORAGE_KEY='madalyon-v2-experiences';
  const categories=['Eğitim','Kariyer','Günlük hayat','Kişisel gelişim','Diğer'];
  const uuid=()=>typeof crypto!=='undefined' && typeof crypto.randomUUID==='function'
    ? crypto.randomUUID(): `exp-${Date.now()}-${Math.random().toString(36).slice(2,12)}`;
  const escapeHtml=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const plainExcerpt=(s,len=118)=>String(s||'').length>len?String(s).slice(0,len).trimEnd()+'…':String(s||'');
  let userStories=[],activeFilter='all',heroIndex=0,heroFace='front',editingId=null,deletingId=null,lastFocused=null;
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    if(Array.isArray(saved)){
      userStories=saved.filter(x=>x && typeof x.title==='string' && typeof x.what==='string')
        .slice(0,100).map(x=>({...x,id:typeof x.id==='string' && x.id?x.id:uuid()}));
    }
  } catch (_) { userStories=[]; }
  const persist=()=>{
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(userStories));return true;}
    catch(_){showToast('Tarayıcı depolamasına erişilemedi; bu değişiklik kalıcı olmayabilir.');return false;}
  };
  function renderShowcase(){
    const s=showcase[heroIndex],front=heroFace==='front';
    $('#hero-category').text(s.category);
    $('#hero-story').html(`<span class="little">${front?'DIŞARIDAN GÖRÜNEN':'PEK KONUŞULMAYAN TARAF'}</span><h3>${escapeHtml(front?s.frontTitle:s.backTitle)}</h3><p>${escapeHtml(front?s.frontText:s.backText)}</p>`);
    $('#story-nudge').text(front?'Diğer yüzünü görmek için dokun ↗':s.tag);
    $('#front-tab').toggleClass('active',front).attr('aria-selected',String(front));
    $('#back-tab').toggleClass('active',!front).attr('aria-selected',String(!front));
  }
  function allStories(){
    return [...userStories.map(s=>({...s,mine:true})),...sampleStories.map((s,i)=>({...s,id:'sample-'+i,mine:false}))];
  }
  function findUser(id){return userStories.find(s=>s.id===id);}
  function renderCards(){
    const entries=allStories().filter(s=>activeFilter==='all'||s.outcome===activeFilter);
    const grid=$('#experiences-grid');
    if(!entries.length){grid.html('<div class="empty">Henüz bu türde bir deneyim bulunmuyor. İlk paylaşan sen olabilirsin.</div>');return;}
    grid.html(entries.map(s=>{
      const good=s.outcome==='good',id=escapeHtml(s.id);
      const ownerActions=s.mine?`<div class="owner-actions"><button class="owner-action" type="button" data-edit="${id}" aria-label="${escapeHtml(s.title)} deneyimini düzenle">Düzenle</button><button class="owner-action delete" type="button" data-delete="${id}" aria-label="${escapeHtml(s.title)} deneyimini sil">Sil</button></div>`:'';
      return `<article class="experience-card"><div class="card-top"><span class="category">${escapeHtml(s.category)}</span><span class="status ${good?'good':'hard'}">${good?'İyi gitti':'Zorlayıcıydı'}</span></div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(plainExcerpt(s.what))}</p><div class="card-bottom"><span class="category-small">${s.mine?'Senin deneyimin':'Örnek deneyim'}</span><button class="read-more" type="button" data-detail="${id}">Hikâyeyi oku <span aria-hidden="true">↗</span></button></div>${ownerActions}</article>`;
    }).join(''));
  }
  function openModal(id){
    lastFocused=document.activeElement;
    const m=$('#'+id);m.addClass('open').attr('aria-hidden','false');
    $('body').css('overflow','hidden');m.find('.close').trigger('focus');
  }
  function closeModal(){
    $('.overlay.open').removeClass('open').attr('aria-hidden','true');
    $('body').css('overflow','');
    if(lastFocused && typeof lastFocused.focus==='function' && document.contains(lastFocused)) lastFocused.focus();
  }
  let toastTimer;
  function showToast(msg){
    const t=$('#toast');t.text(msg).addClass('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.removeClass('show'),3700);
  }
  function resetForm(){
    editingId=null;$('#compose-form')[0].reset();
    $('#compose-title').text('Madalyonun senin tarafında ne var?');
    $('#submit-story').text('Deneyimimi ekle ↗');
  }
  function showCreate(){resetForm();openModal('compose-overlay');}
  function editStory(id){
    const s=findUser(id);if(!s)return;
    resetForm();editingId=id;
    $('#f-title').val(s.title);$('#f-category').val(s.category);$('#f-outcome').val(s.outcome);
    $('#f-what').val(s.what);$('#f-why').val(s.why);$('#f-lesson').val(s.lesson);
    $('#compose-title').text('Deneyimini güncelle');
    $('#submit-story').text('Değişiklikleri kaydet ↗');
    closeModal();openModal('compose-overlay');
  }
  function askDelete(id){
    if(!findUser(id))return;
    deletingId=id;closeModal();openModal('delete-overlay');
  }
  function showDetail(id){
    const s=allStories().find(x=>x.id===id);if(!s)return;
    const footer=s.mine?`<div class="detail-actions"><button class="btn btn-light" type="button" data-edit="${escapeHtml(id)}">Deneyimi düzenle</button><button class="btn" type="button" data-delete="${escapeHtml(id)}">Deneyimi sil</button></div>`:'';
    $('#detail-content').html(`<span class="detail-category">${escapeHtml(s.category)} · ${s.outcome==='good'?'İyi gitti':'Zorlayıcıydı'}</span><h2 id="detail-title">${escapeHtml(s.title)}</h2><div class="detail-row"><strong>Ne oldu?</strong><p>${escapeHtml(s.what)}</p></div><div class="detail-row"><strong>Sence neden oldu?</strong><p>${escapeHtml(s.why)}</p></div><div class="detail-row"><strong>Bu deneyimden ne öğrendim?</strong><p>${escapeHtml(s.lesson)}</p></div>${footer}`);
    openModal('detail-overlay');
  }
  $('#front-tab').on('click',()=>{heroFace='front';renderShowcase();});
  $('#back-tab').on('click',()=>{heroFace='back';renderShowcase();});
  $('#prev-story').on('click',()=>{heroIndex=(heroIndex+showcase.length-1)%showcase.length;heroFace='front';renderShowcase();});
  $('#next-story').on('click',()=>{heroIndex=(heroIndex+1)%showcase.length;heroFace='front';renderShowcase();});
  $('[data-filter]').on('click',function(){
    activeFilter=$(this).data('filter');$('[data-filter]').removeClass('active');$(this).addClass('active');renderCards();
  });
  $(document).on('click','[data-detail]',function(){showDetail(String($(this).attr('data-detail')));});
  $(document).on('click','[data-edit]',function(){editStory(String($(this).attr('data-edit')));});
  $(document).on('click','[data-delete]',function(){askDelete(String($(this).attr('data-delete')));});
  $('[data-open-compose]').on('click',showCreate);
  $('[data-close]').on('click',closeModal);
  $('.overlay').on('click',function(e){if(e.target===this)closeModal();});
  $(document).on('keydown',function(e){if(e.key==='Escape')closeModal();});
  $('#confirm-delete').on('click',function(){
    if(!deletingId)return;
    const id=deletingId;deletingId=null;
    userStories=userStories.filter(s=>s.id!==id);
    persist();renderCards();closeModal();showToast('Deneyimin silindi.');
  });
  $('#compose-form').on('submit',function(e){
    e.preventDefault();
    if(!this.reportValidity())return;
    const f=new FormData(this);
    const s={title:String(f.get('title')||'').trim(),category:String(f.get('category')||'').trim(),outcome:String(f.get('outcome')||''),what:String(f.get('what')||'').trim(),why:String(f.get('why')||'').trim(),lesson:String(f.get('lesson')||'').trim()};
    if(!s.title||s.title.length>90||!categories.includes(s.category)||!['good','hard'].includes(s.outcome)||!s.what||!s.why||!s.lesson||[s.what,s.why,s.lesson].some(x=>x.length>750)){
      showToast('Lütfen alanları doğru ve eksiksiz doldur.');return;
    }
    const wasEdit=!!editingId;
    if(wasEdit){const idx=userStories.findIndex(x=>x.id===editingId);if(idx<0)return;userStories[idx]={...s,id:editingId};}
    else{userStories.unshift({...s,id:uuid()});}
    persist();editingId=null;
    activeFilter='all';$('[data-filter]').removeClass('active');$('[data-filter="all"]').addClass('active');
    renderCards();resetForm();closeModal();
    showToast(wasEdit?'Deneyimin güncellendi.':'Deneyimin bu tarayıcıya eklendi.');
    $('#deneyimler')[0].scrollIntoView({behavior:'smooth',block:'start'});
  });
  renderShowcase();renderCards();
})(jQuery);
