const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>60);},{passive:true});
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
hamburger.addEventListener('click',()=>{hamburger.classList.toggle('active');mobileMenu.classList.toggle('active');});
document.querySelectorAll('.mobile-menu .nav-link,.mobile-menu .nav-cta').forEach(el=>{el.addEventListener('click',()=>{hamburger.classList.remove('active');mobileMenu.classList.remove('active');});});
function scrollToTop(){window.scrollTo({top:0,behavior:'smooth'});}
const filterBtns=document.querySelectorAll('.filter-btn');
const productCards=document.querySelectorAll('.product-card');
filterBtns.forEach(btn=>{btn.addEventListener('click',()=>{filterBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;productCards.forEach(card=>{card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f);});});});
const revealObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revealObs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));
const toast=document.getElementById('toast');
function showToast(title,msg,ok){document.getElementById('toastTitle').textContent=title;document.getElementById('toastMsg').textContent=msg;toast.classList.toggle('success',!!ok);toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4200);}
document.getElementById('contactForm').addEventListener('submit',function(e){e.preventDefault();const n=document.getElementById('fname').value.trim(),em=document.getElementById('femail').value.trim(),s=document.getElementById('fsubject').value.trim(),m=document.getElementById('fmessage').value.trim();if(!n||!em||!s||!m){showToast('Incomplete','Please fill in all fields.',false);return;}const body='Name: '+n+'%0D%0AEmail: '+em+'%0D%0A%0D%0A'+encodeURIComponent(m);showToast('Message Ready','Opening your email client...',true);setTimeout(()=>{window.location.href='mailto:DyedForAmerica@Gmail.com?subject='+encodeURIComponent(s)+'&body='+body;this.reset();},700);});
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){const t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'});}});});
