const flowers = [
{name:'Peony',season:'spring',image:'peony',subtitle:'Soft layers. A fleeting kind of beauty.',description:'With their generous layers of petals, peonies turn a single stem into a whole occasion. Their short flowering season makes their arrival feel especially worth noticing.',tip:'Choose buds that feel soft rather than tightly closed. Give each flower room to open in the vase.'},
{name:'Cosmos',season:'summer',image:'cosmos',subtitle:'A little wild. Completely wonderful.',description:'Papery petals, golden centers, and feathery leaves give cosmos a light, meadow-like feel. Their long stems bring movement to an informal bunch.',tip:'Handle the delicate stems gently and place them in water soon after cutting.'},
{name:'Dahlia',season:'autumn',image:'dahlia',subtitle:'The garden’s grand finale.',description:'From tiny pompons to dinner-plate blooms, dahlias make late-season gardens feel wonderfully abundant. Their geometric petals reward a closer look.',tip:'Choose flowers that are already open. Tightly closed dahlia buds usually do not open well after cutting.'},
{name:'Tulip',season:'spring',image:'tulip',subtitle:'A fresh start, one stem at a time.',description:'A simple cup-shaped bloom with a surprising amount of personality. Tulips bend toward the light and continue changing shape in the vase.',tip:'Use a tall vase to support the stems and leave a little room for them to curve naturally.'},
{name:'Sunflower',season:'summer',image:'sunflower',subtitle:'A small piece of sunshine.',description:'Broad golden petals and a richly textured center make sunflowers instantly recognizable. A few tall stems bring warmth to even the simplest arrangement.',tip:'Use a sturdy vase for their heavy heads and check the water level daily.'},
{name:'Rose',season:'summer',image:'rose',subtitle:'An old favorite, for good reason.',description:'From loose garden blooms to tightly layered rosettes, roses come in a remarkable range of shapes and colors. Fragrance varies, so take a moment to find your favorite.',tip:'Remove leaves below the waterline and recut stems before arranging. Keep the flowers away from direct heat.'}
];
const grid=document.querySelector('#flower-grid');const dialog=document.querySelector('#flower-dialog');
function render(season){const filtered=flowers.filter(f=>season==='all'||f.season===season);grid.replaceChildren();filtered.forEach(f=>{const card=document.createElement('button');card.className='flower-card';card.setAttribute('aria-label',`Learn about ${f.name}`);card.innerHTML=`<div class="photo-wrap"><img src="assets/${f.image}.jpg" alt="${f.name} blooms" loading="lazy"><span class="season-tag">${f.season[0].toUpperCase()+f.season.slice(1)}</span></div><h3>${f.name}<span aria-hidden="true">↗</span></h3><p>${f.subtitle}</p>`;card.addEventListener('click',()=>{document.querySelector('#dialog-content').innerHTML=`<img src="assets/${f.image}.jpg" alt="${f.name} blooms"><p class="eyebrow">The flower guide / ${f.season}</p><h2 id="dialog-title">${f.name}</h2><p>${f.description}</p><p class="tip"><strong>A little care</strong><br>${f.tip}</p>`;dialog.showModal()});grid.append(card)});document.querySelector('#count').textContent=`${filtered.length} flowers to discover`}
document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-season]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});render(button.dataset.season)}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});render('all');

// A small, keyboard-accessible garden. All artwork is drawn locally.
const plantingArea = document.querySelector('#planting-area');
const gardenArt = document.querySelector('#garden-art');
const gardenCount = document.querySelector('#garden-count');
let petalColor = '#ffc52e';
let plantedCount = 0;
const svgNS = 'http://www.w3.org/2000/svg';
function svgElement(name, attributes) {
  const element = document.createElementNS(svgNS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}
function plantFlower(x, y) {
  // Cap the canvas to keep repeated play responsive.
  if (gardenArt.children.length >= 80) gardenArt.firstElementChild.remove();
  const bounds = plantingArea.getBoundingClientRect();
  if (!gardenArt.children.length) gardenArt.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  const width = gardenArt.viewBox.baseVal.width;
  const height = gardenArt.viewBox.baseVal.height;
  x = x * width / bounds.width;
  y = y * height / bounds.height;
  x = Math.max(30, Math.min(width - 30, x));
  y = Math.max(45, Math.min(height - 65, y));
  const flower = svgElement('g', {class: 'planted-flower'});
  const stemEnd = Math.min(height + 10, y + 100 + Math.random() * 60);
  flower.append(svgElement('path', {d: `M ${x} ${y} Q ${x - 15} ${y + 65} ${x + 5} ${stemEnd}`, stroke: '#68763b', 'stroke-width': 4, fill: 'none'}));
  flower.append(svgElement('ellipse', {cx:x + 12, cy:y + 52, rx:17, ry:7, fill:'#84904d', transform:`rotate(-32 ${x + 12} ${y + 52})`}));
  for (let i = 0; i < 8; i++) {
    flower.append(svgElement('ellipse', {cx:x, cy:y - 19, rx:10, ry:19, fill:petalColor, stroke:'#79552e', 'stroke-width':.65, transform:`rotate(${i * 45} ${x} ${y})`}));
  }
  flower.append(svgElement('circle', {cx:x, cy:y, r:12, fill:'#80502c'}));
  flower.append(svgElement('circle', {cx:x - 3, cy:y - 3, r:3, fill:'#b4813f'}));
  gardenArt.append(flower);
  plantedCount++;
  document.querySelector('.garden-prompt').hidden = true;
  gardenCount.textContent = `${plantedCount} ${plantedCount === 1 ? 'flower planted. A lovely start.' : 'flowers planted. Look at you grow.'}`;
}
plantingArea.addEventListener('click', event => {
  const bounds = plantingArea.getBoundingClientRect();
  plantFlower(event.clientX - bounds.left, event.clientY - bounds.top);
});
plantingArea.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    plantFlower(40 + Math.random() * (plantingArea.clientWidth - 80), 75 + Math.random() * (plantingArea.clientHeight - 150));
  }
});
document.querySelectorAll('[data-petal]').forEach(button => button.addEventListener('click', () => {
  petalColor = button.dataset.petal;
  document.querySelectorAll('[data-petal]').forEach(choice => {
    choice.classList.toggle('selected', choice === button);
    choice.setAttribute('aria-pressed', String(choice === button));
  });
}));
document.querySelector('#clear-garden').addEventListener('click', () => {
  gardenArt.replaceChildren();
  plantedCount = 0;
  document.querySelector('.garden-prompt').hidden = false;
  gardenCount.textContent = 'A fresh patch. What will you grow next?';
});
