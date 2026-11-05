(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const CROPS = {
    carrot:{name:"Carrot",emoji:"🥕",cost:8,value:18,grow:1,xp:8,unlock:1},
    wheat:{name:"Wheat",emoji:"🌾",cost:12,value:26,grow:2,xp:12,unlock:2},
    tomato:{name:"Tomato",emoji:"🍅",cost:20,value:45,grow:2,xp:17,unlock:3},
    corn:{name:"Corn",emoji:"🌽",cost:30,value:70,grow:3,xp:23,unlock:4},
    pumpkin:{name:"Pumpkin",emoji:"🎃",cost:45,value:115,grow:4,xp:32,unlock:5}
  };
  const PLOT_COUNT=25, START_COINS=100;
  const freshState=()=>({coins:START_COINS,level:1,xp:0,day:1,tool:"plant",seed:"carrot",plots:Array.from({length:PLOT_COUNT},()=>null),inventory:{},waterUpgrade:0,priceUpgrade:0,extraPlots:0,questsDone:[],sound:true});
  let state=load();
  let toastTimer;
  function load(){try{const s=JSON.parse(localStorage.getItem("miniFarmLifeSave"));if(s&&Array.isArray(s.plots)&&s.plots.length===PLOT_COUNT)return {...freshState(),...s};}catch(e){}return freshState();}
  function save(){localStorage.setItem("miniFarmLifeSave",JSON.stringify(state));}
  function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2100);}
  function sound(freq=520){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.045,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.12);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.13);o.onended=()=>c.close();}catch(e){}}
  function xpNeeded(){return 50+(state.level-1)*35;}
  function addXP(n){state.xp+=n;while(state.xp>=xpNeeded()){state.xp-=xpNeeded();state.level++;state.coins+=25;toast(`Level up! You're now level ${state.level}. +25 coins!`);sound(760);}}
  function unlockedPlots(){return Math.min(PLOT_COUNT,16+state.extraPlots*3);}
  function isUnlockedCrop(id){return state.level>=CROPS[id].unlock;}
  function render(){
    $("coins").textContent=state.coins;$("level").textContent=state.level;$("day").textContent=state.day;
    $("xp-label").textContent=`Level ${state.level} · ${state.xp} / ${xpNeeded()} XP`;
    $("next-level").textContent=`Next: Level ${state.level+1}`;
    $("xp-fill").style.width=`${Math.min(100,state.xp/xpNeeded()*100)}%`;
    $("selected-seed").textContent=`${CROPS[state.seed].emoji} ${CROPS[state.seed].name}`;
    $("weather").textContent=state.day%5===0?"🌦️ Gentle rain":"☀️ Sunny day";
    renderPlots();renderSeeds();renderInventory();save();
  }
  function renderPlots(){
    const grid=$("farm-grid");grid.innerHTML="";
    state.plots.forEach((plot,i)=>{
      const b=document.createElement("button");b.className="plot";b.type="button";
      if(i>=unlockedPlots()){b.classList.add("locked");b.innerHTML='<span class="crop">🔒</span><span class="plot-label">Locked</span>';}
      else if(!plot){b.classList.add("empty");b.innerHTML='<span class="crop">＋</span><span class="plot-label">Empty plot</span>';}
      else{
        const crop=CROPS[plot.crop],ready=plot.days<=0;
        b.classList.toggle("ready",ready);
        b.innerHTML=`<span class="crop">${ready?crop.emoji:(plot.watered?"💧":"🌱")}</span><span class="plot-label">${ready?"Ready!":crop.name+" · "+plot.days+"d"}</span>${plot.watered?'<span class="water-drop">💧</span>':""}`;
      }
      b.addEventListener("click",()=>usePlot(i));grid.appendChild(b);
    });
  }
  function renderSeeds(){
    const list=$("seed-list");list.innerHTML="";
    Object.entries(CROPS).forEach(([id,c])=>{
      const locked=!isUnlockedCrop(id),el=document.createElement("div");
      el.className="seed-card"+(state.seed===id?" selected":"")+(locked?" locked":"");
      el.innerHTML=`<div class="seed-emoji">${locked?"🔒":c.emoji}</div><div class="seed-info"><strong>${c.name}</strong><small>${locked?"Unlock at level "+c.unlock:`${c.grow} day${c.grow>1?"s":""} · Sell ${c.value} coins`}</small></div><button class="seed-buy" ${locked||state.coins<c.cost?"disabled":""}>${locked?"Locked":"Buy · 🪙"+c.cost}</button>`;
      el.querySelector("button").addEventListener("click",()=>{
        if(locked)return;if(state.coins<c.cost){toast("Not enough coins! Sell some harvest first.");return;}
        state.coins-=c.cost;state.seed=id;state.tool="plant";syncTools();render();toast(`${c.name} seeds selected. Tap an empty plot!`);sound();
      });
      el.addEventListener("click",e=>{if(e.target.tagName==="BUTTON")return;if(!locked){state.seed=id;state.tool="plant";syncTools();render();}});
      list.appendChild(el);
    });
  }
  function renderInventory(){
    const box=$("inventory"),items=Object.entries(state.inventory).filter(([,n])=>n>0);
    box.innerHTML=items.length?items.map(([id,n])=>`<div class="inventory-row"><span>${CROPS[id].emoji} ${CROPS[id].name}</span><span>× ${n}</span></div>`).join(""):'<div class="empty-inventory">Your basket is empty. Time to grow something!</div>';
  }
  function usePlot(i){
    if(i>=unlockedPlots()){toast("Unlock more farm space in Upgrades.");return;}
    const p=state.plots[i],tool=state.tool;
    if(tool==="plant"){
      if(p){toast("This plot is already growing something.");return;}
      const c=CROPS[state.seed];if(state.coins<c.cost){toast("Not enough coins for those seeds.");return;}
      state.coins-=c.cost;state.plots[i]={crop:state.seed,days:c.grow,watered:false};toast(`${c.name} planted!`);sound(620);
    }else if(tool==="water"){
      if(!p){toast("Plant something before watering.");return;}
      if(p.days<=0){toast("This crop is already ready!");return;}
      if(p.watered){toast("This crop is already watered today.");return;}
      p.watered=true;toast("Splash! Crop watered. 💧");sound(700);
    }else if(tool==="harvest"){
      if(!p){toast("Nothing to harvest here.");return;}
      if(p.days>0){toast("Not ready yet. Give it a little time!");return;}
      state.inventory[p.crop]=(state.inventory[p.crop]||0)+1;addXP(CROPS[p.crop].xp);state.plots[i]=null;toast(`${CROPS[p.crop].name} harvested! +${CROPS[p.crop].xp} XP`);sound(820);
    }else if(tool==="clear"){
      if(!p){toast("This plot is already empty.");return;}
      state.plots[i]=null;toast("Plot cleared.");sound(330);
    }
    render();
  }
  function syncTools(){document.querySelectorAll(".tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===state.tool));}
  function nextDay(){
    state.day++;
    const rain=state.day%5===0;
    state.plots.forEach(p=>{if(!p)return;if(p.days>0){p.days-=1;if(p.watered&&p.days>0)p.days-=1; if(rain&&p.days>0)p.days-=1;}p.watered=false;});
    $("farm-message").textContent=rain?"A gentle rain watered your farm!":"A new day on Sunny Acres!";
    toast(rain?"Rainy day! Crops grew faster.":"A new day begins! Crops have grown.");sound(430);render();
  }
  function sellAll(){
    let total=0,count=0;
    Object.entries(state.inventory).forEach(([id,n])=>{const value=CROPS[id].value+state.priceUpgrade*5;total+=value*n;count+=n;state.inventory[id]=0;});
    if(!count){toast("Your basket is empty!");return;}
    state.coins+=total;addXP(count*3);toast(`Sold ${count} harvest item(s) for ${total} coins!`);sound(880);render();
  }
  function openModal(html){$("modal-content").innerHTML=html;$("modal").classList.remove("hidden");}
  function closeModal(){$("modal").classList.add("hidden");}
  function upgrades(){
    const upgrades=[
      {id:"water",icon:"💧",name:"Better Watering Can",desc:"Watered crops grow one extra day faster.",cost:80+state.waterUpgrade*90,level:state.waterUpgrade,max:3},
      {id:"price",icon:"💰",name:"Market Stall",desc:"Earn 5 extra coins for every crop you sell.",cost:100+state.priceUpgrade*110,level:state.priceUpgrade,max:4},
      {id:"plots",icon:"🪴",name:"Expand Your Farm",desc:"Unlock 3 additional plots for planting.",cost:120+state.extraPlots*130,level:state.extraPlots,max:3}
    ];
    openModal(`<h2>Farm Upgrades</h2><p class="sub">Invest your coins to make Sunny Acres even better.</p><div class="upgrade-grid">${upgrades.map(u=>`<div class="upgrade-card"><div class="modal-hero">${u.icon}</div><h3>${u.name} · ${u.level}/${u.max}</h3><p>${u.desc}</p><button class="primary-btn" data-upgrade="${u.id}" ${u.level>=u.max||state.coins<u.cost?"disabled":""}>${u.level>=u.max?"MAX LEVEL":"Upgrade · 🪙 "+u.cost}</button></div>`).join("")}</div><div class="modal-note">You have 🪙 ${state.coins} coins. Upgrades are saved automatically.</div>`);
    document.querySelectorAll("[data-upgrade]").forEach(b=>b.addEventListener("click",()=>buyUpgrade(b.dataset.upgrade)));
  }
  function buyUpgrade(id){
    const costs={water:80+state.waterUpgrade*90,price:100+state.priceUpgrade*110,plots:120+state.extraPlots*130};
    const max={water:3,price:4,plots:3},key={water:"waterUpgrade",price:"priceUpgrade",plots:"extraPlots"}[id];
    if(state[key]>=max[id]||state.coins<costs[id])return;
    state.coins-=costs[id];state[key]++;toast("Upgrade purchased!");sound(740);upgrades();render();
  }
  function quests(){
    const tasks=[
      {id:"plant",title:"Green Thumb",desc:"Have 3 crops growing at once.",goal:()=>state.plots.filter(Boolean).length>=3,reward:35},
      {id:"harvest",title:"First Harvest",desc:"Harvest at least 2 crops.",goal:()=>Object.values(state.inventory).reduce((a,b)=>a+b,0)>=2,reward:40},
      {id:"level",title:"Growing Up",desc:"Reach level 2.",goal:()=>state.level>=2,reward:50}
    ];
    openModal(`<h2>Daily Quests</h2><p class="sub">Little goals, lovely rewards. Each quest can be claimed once.</p>${tasks.map(q=>{const done=q.goal(),claimed=state.questsDone.includes(q.id);return `<div class="quest-card"><div><h3>${claimed?"✅":done?"🎉":"📌"} ${q.title}</h3><p>${q.desc}<br>Reward: 🪙 ${q.reward}</p></div><button class="primary-btn" data-quest="${q.id}" ${!done||claimed?"disabled":""}>${claimed?"Claimed":done?"Claim":"In progress"}</button></div>`;}).join("")}`);
    document.querySelectorAll("[data-quest]").forEach(b=>b.addEventListener("click",()=>{const q=tasks.find(x=>x.id===b.dataset.quest);if(q&&!state.questsDone.includes(q.id)&&q.goal()){state.questsDone.push(q.id);state.coins+=q.reward;toast(`Quest complete! +${q.reward} coins`);sound(900);quests();render();}}));
  }
  function settings(){
    openModal(`<h2>Farm Settings</h2><p class="sub">Make your little farm feel just right.</p><div class="settings-row"><span>Sound effects</span><button class="secondary-btn" id="sound-toggle">${state.sound?"🔊 On":"🔇 Off"}</button></div><div class="settings-row"><span>Save game</span><button class="secondary-btn" id="save-now">💾 Save now</button></div><div class="settings-row"><span>Start a new farm</span><button class="secondary-btn" id="reset-game">↻ Reset</button></div><div class="modal-note">Your progress is saved automatically in this browser on this device.</div>`);
    $("sound-toggle").onclick=()=>{state.sound=!state.sound;settings();save();};
    $("save-now").onclick=()=>{save();toast("Farm saved!");};
    $("reset-game").onclick=()=>{if(confirm("Start over? Your current farm save will be erased.")){state=freshState();closeModal();render();toast("A fresh new farm awaits!");}};
  }
  document.querySelectorAll(".tool").forEach(b=>b.addEventListener("click",()=>{state.tool=b.dataset.tool;syncTools();}));
  document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.page==="upgrades")upgrades();if(b.dataset.page==="quests")quests();if(b.dataset.page==="settings")settings();if(b.dataset.page==="farm")closeModal();}));
  $("next-day").addEventListener("click",nextDay);$("sell-all").addEventListener("click",sellAll);
  $("modal-close").addEventListener("click",closeModal);$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal();});
  syncTools();render();
})();