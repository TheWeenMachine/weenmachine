import { useState, useEffect } from "react";

const SUPABASE_URL = "https://uiqexanfeusvfgntflhm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWV4YW5mZXVzdmZnbnRmbGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzAwODMsImV4cCI6MjA5NTgwNjA4M30.-dPrl7J1wDG_iSw09KdIqqVIlQGYGaP6nsj6Ffnfp0k";

const CATEGORIES = [
  "Site & Location","Architecture & Exterior","Structure & Size",
  "Water & Marine","Gym & Fitness / Wellness","Kitchen & Scullery",
  "Interior Finishes & Style","Primary Suite","Outdoor & Landscape",
  "Smart Home & Systems","Infrastructure & Mechanical","Nice to Have"
];
const PRIORITIES = ["Must Have","Want","Nice to Have"];
const SOURCES = ["Existing","2026 Trend"];
const STATUSES = ["Under Discussion","Confirmed","Rejected","Deferred"];
const GROCERY_CATS = ["Produce","Meat & Fish","Dairy","Bakery","Pantry","Frozen","Drinks","Household","Other"];

const PC = {
  "Must Have":    { border:"#4a7c4a", badge:"#2d5a2d", chip:"#7dbb7d", label:"MUST" },
  "Want":         { border:"#4a6a9c", badge:"#2d4a7c", chip:"#7d9dcc", label:"WANT" },
  "Nice to Have": { border:"#9c7a4a", badge:"#7c5a2d", chip:"#ccaa6d", label:"NICE" },
};
const SC = {
  "Existing":   { color:"#4a7c4a", label:"EXISTING" },
  "2026 Trend": { color:"#7a4a9c", label:"TREND" },
};

const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function sb(method, table, body, id) {
  const base = `${SUPABASE_URL}/rest/v1/${table}`;
  const url = method === "GET"
    ? `${base}?order=created_at.asc&limit=500`
    : id ? `${base}?id=eq.${id}` : base;
  const res = await fetch(url, {
    method,
    headers: { ...HEADERS, "Prefer": method === "POST" ? "return=representation" : "return=minimal" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (method === "GET") return res.json();
  if (!res.ok) { const t = await res.text(); throw new Error(t); }
  return true;
}const SEED = [
  { text:"Waterfront — ocean frontage, Saanich Peninsula", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Primary driver of the BC move" },
  { text:"Deep Cove / North Saanich neighbourhood", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"R-2 zoning, low density, quiet marine community" },
  { text:"Private lot — minimal visible neighbours", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"South or SW facing water views", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Light quality, afternoon sun" },
  { text:"Lot size sufficient for detached gym (~1,098 sq ft accessory, R-2 max)", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Confirmed permitted under North Saanich Bylaw 1255" },
  { text:"Deep water moorage or mooring buoy access", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Required for Pursuit OS 355 — Van Isle Marina fallback" },
  { text:"Walking distance / short drive to Sidney marine services", category:"Site & Location", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Northwest Contemporary — clean lines, deep overhangs, expansive glass", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Dominant 2026 PNW style: wood, stone, metal, low-pitched roof" },
  { text:"Retractable glass facade / folding glass walls to outdoor living", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Most-requested feature in 2026 Vancouver luxury renovations" },
  { text:"Deep covered veranda / outdoor room — heated, functional year-round", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Covered patios with built-in heating top 2026 PNW requests" },
  { text:"Natural material exterior — reclaimed wood, natural stone, weathering metal", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Reclaimed wood and natural stone leading 2026 luxury exterior palette" },
  { text:"Shakkei borrowed scenery — windows frame specific views deliberately", category:"Architecture & Exterior", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Japanese-influenced PNW trend: every transition engineered to engage the water" },
  { text:"Black architectural accents — posts, trim, beams", category:"Architecture & Exterior", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Replacing millennial grey; warm black paired with natural tones" },
  { text:"Green roof or living wall section", category:"Architecture & Exterior", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"Gaining traction in PNW temperate climate" },
  { text:"4,000+ sq ft main house", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"4+ bedrooms (guest capacity)", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Dedicated home office with water view", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"AI workflow, market monitoring, Q Lab Python work" },
  { text:"3+ car garage (EV-ready)", category:"Structure & Size", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Defender Octa + daily driver + spare" },
  { text:"Main-floor primary suite (aging-in-place planning)", category:"Structure & Size", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Longevity lens" },
  { text:"Defined zones within open plan — partial walls, ceiling transitions", category:"Structure & Size", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 Vancouver trend: openness retained but zones articulated" },
  { text:"Butlers pantry / scullery behind main kitchen", category:"Structure & Size", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Major 2026 luxury kitchen trend" },
  { text:"Dedicated gear/mudroom — fishing, ski, marine, outdoor kit storage", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Private dock or foreshore suitable for dock construction", category:"Water & Marine", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Critical for OS 355 home-port option" },
  { text:"Covered boathouse or winter moorage capability", category:"Water & Marine", priority:"Want", source:"Existing", status:"Under Discussion", notes:"OS 355 all-weather storage" },
  { text:"Beach / foreshore access", category:"Water & Marine", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Multisensory waterfront deck — fire, lighting, audio, seasonal dining", category:"Water & Marine", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 outdoor trend: waterfront zones as immersive multi-season environments" },
  { text:"Detached gym building 800-1098 sq ft, high ceilings 12 ft+", category:"Gym & Fitness / Wellness", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Vasper, Peloton, BFR, strength — dedicated power + HVAC required" },
  { text:"Gym with water view or direct natural light", category:"Gym & Fitness / Wellness", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Wellness architecture: circadian lighting system throughout home", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury: circadian-tuned lighting for sleep + cognition" },
  { text:"Dedicated wellness circuit: sauna to cold plunge to rest zone", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Fire and Ice recovery circuit — fastest-growing 2026 luxury request" },
  { text:"Chromotherapy / infrared sauna", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 wellness architecture: chromotherapy sauna + restoration zones" },
  { text:"Advanced air + water purification whole-home", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury wellness: air/water quality as baseline infrastructure" },
  { text:"Wellness zone placed for privacy — greenery screening, natural surround", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Outdoor wellness zones sited in private corners" },
  { text:"Open-plan kitchen / great room facing water — architectural joinery aesthetic", category:"Kitchen & Scullery", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Quiet luxury palette: white oak or walnut cabinetry, creamy whites, warm earthy neutrals", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"96% of industry pros cite warm neutrals as top 2026 kitchen colour" },
  { text:"Waterfall island — natural stone, honed or leathered finish not polished", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Matte/honed/leathered countertops replacing glossy" },
  { text:"Fully integrated / concealed appliances flush refrigerator, hidden cooktop", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 trend: appliances disappear into cabinetry" },
  { text:"Walk-in pantry replacing open shelving", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Open shelving declining; hidden storage + pantry preferred" },
  { text:"Scullery / prep kitchen behind main kitchen", category:"Kitchen & Scullery", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Butlers pantry comeback: mess prep out of sight from great room" },
  { text:"Sub-Zero / Wolf / Miele or Fisher and Paykel appliance tier", category:"Kitchen & Scullery", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Wine storage — dedicated temperature-controlled room or integrated column", category:"Kitchen & Scullery", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Mixed-material cabinetry — wood + glass + metal for layered tactile depth", category:"Kitchen & Scullery", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 trend: combining wood, glass, leather, metal" },
  { text:"Limewash walls — tone shifts with light, depth without paint flatness", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Calling card of 2026 quiet luxury interiors" },
  { text:"Natural stone in unexpected ways — raw texture, not over-polished", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 trend: stone authenticity valued over perfection" },
  { text:"Warm earthy palette — mushroom, taupe, greige, soft clay, muted green", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Cool greys and stark white out; earthy warmth dominant 2026 PNW palette" },
  { text:"Brushed brass / oil-rubbed bronze / warm black hardware not chrome", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Shiny metallics out; warm-toned brushed finishes replacing chrome" },
  { text:"Sculptural / experiential ceilings — floating planes, woven wood insets", category:"Interior Finishes & Style", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury trend: ceilings as architectural focal points" },
  { text:"Biophilic design — indoor living walls, indoor water feature, botanical elements", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Strong PNW trend: organic interiors continuous with marine surroundings" },
  { text:"Media room / home theatre", category:"Interior Finishes & Style", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"Classic film canon — Bond, LOTR, Godfather" },
  { text:"Large primary suite — water view, main floor", category:"Primary Suite", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Hotel-inspired bathroom — wellness retreat, not utility space", category:"Primary Suite", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 Vancouver: bathrooms as calming wellness sanctuaries" },
  { text:"Wet room / walk-in shower with natural stone, no threshold", category:"Primary Suite", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Low-maintenance materials + improved ventilation" },
  { text:"Freestanding soaker tub with water view", category:"Primary Suite", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Scent + light + sound wellness zone controls in primary bath", category:"Primary Suite", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury: customizable wellness zones with lighting, scent, climate" },
  { text:"Architecture-first outdoor master plan — distinct zones for dining, lounging, wellness, fire", category:"Outdoor & Landscape", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 shift: outdoor master plan as unified vision" },
  { text:"Covered heated outdoor kitchen / culinary zone", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Outdoor kitchens maturing to restaurant-grade culinary stations" },
  { text:"Fire feature — architectural not kit firepit, paired with warm natural tones", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026: fire features more customizable and architecturally integrated" },
  { text:"Multi-sensory outdoor layers — integrated lighting, audio, fire, water", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury outdoor: sensory layering as design principle" },
  { text:"Heated pool / lap pool with integrated spa — sun shelf, sculptural water feature", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026: pools as multi-role environments" },
  { text:"Privacy landscaping as functional architecture — native/rocky low-maintenance screening", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Privacy architecture finishes the space" },
  { text:"Smart outdoor lighting — app/voice control, mood-layered", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 outdoor: lighting less about function, more about mood" },
  { text:"Whole-home smart integration — voice/app climate, lighting, security, audio", category:"Smart Home & Systems", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"2026: seamless, discreet, embedded technology" },
  { text:"Security with facial recognition / advanced monitoring", category:"Smart Home & Systems", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Extended absences make this critical" },
  { text:"Smart glass — auto-tint based on sunlight / time of day", category:"Smart Home & Systems", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Reduces glare on water-facing glass without blinds" },
  { text:"AI-powered home system — anticipates preferences, biometric-responsive", category:"Smart Home & Systems", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury: emotional intelligence — systems adapt to mood/routine" },
  { text:"Whole-home audio indoor + outdoor", category:"Smart Home & Systems", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Backup generator — whole-home", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Island power reliability" },
  { text:"Fibre internet required for AI workflows, market monitoring", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"EV charging — Level 2 minimum, ideally dual", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Defender Octa + second vehicle" },
  { text:"Heat pump heating + cooling + radiant in-floor heating", category:"Infrastructure & Mechanical", priority:"Want", source:"Existing", status:"Under Discussion", notes:"BC climate — primarily heating; heat pump efficiency + radiant comfort" },
  { text:"Passive design principles — strategic window placement, triple-glazed, thermal mass", category:"Infrastructure & Mechanical", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 PNW luxury: passive home strategies as defining marker of quality" },
  { text:"Advanced water filtration whole-home, culinary-grade", category:"Infrastructure & Mechanical", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"2026 wellness architecture: water quality as infrastructure" },
  { text:"Seaplane float or proximity to Harbour Air float access", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"Harbour Air connectivity to Vancouver YVR" },
  { text:"Guest cottage / carriage house", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Helicopter pad or pad-suitable area", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Salt inhalation room / sensory deprivation tank", category:"Nice to Have", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"2026 luxury wellness: halotherapy gaining traction" },
  { text:"Courtyard / internal garden — Japanese-influenced serene framing", category:"Nice to Have", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"Shakkei design: interior courtyards as composed natural scenes" },
];export default function WeenTeam() {
  const [screen, setScreen] = useState("home");
  const [items, setItems] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState(null);
  const [activeCat, setActiveCat] = useState("All");
  const [priFilter, setPriFilter] = useState("All");
  const [srcFilter, setSrcFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({ text:"", category:CATEGORIES[0], priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" });
  const [editItem, setEditItem] = useState({});
  const [newGrocery, setNewGrocery] = useState({ item:"", category:"General", added_by:"" });
  const [showAddGrocery, setShowAddGrocery] = useState(false);

  useEffect(() => {
    if (screen === "attributes") loadAttributes();
    if (screen === "groceries") loadGroceries();
  }, [screen]);

  async function loadAttributes() {
    setLoading(true); setError(null);
    try { setItems(await sb("GET","home_attributes")); }
    catch { setError("Could not connect to Supabase."); }
    setLoading(false);
  }

  async function loadGroceries() {
    setLoading(true); setError(null);
    try { setGroceries(await sb("GET","groceries")); }
    catch { setError("Could not connect to Supabase."); }
    setLoading(false);
  }

  async function seedData() {
    setSeeding(true); setError(null);
    try {
      for (const item of SEED) {
        await sb("POST","home_attributes", item);
      }
      await loadAttributes();
    } catch(e) { setError("Seed failed: " + e.message); }
    setSeeding(false);
  }

  async function handleAddAttr() {
    if (!newItem.text.trim()) return;
    setSaving(true);
    try {
      await sb("POST","home_attributes", newItem);
      await loadAttributes();
      setNewItem({ text:"", category:CATEGORIES[0], priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" });
      setShowAdd(false);
    } catch { setError("Save failed."); }
    setSaving(false);
  }

  async function handleUpdateAttr() {
    setSaving(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/home_attributes?id=eq.${editingId}`, {
        method:"PATCH",
        headers:{ ...HEADERS },
        body: JSON.stringify({ text:editItem.text, category:editItem.category, priority:editItem.priority, source:editItem.source, status:editItem.status, notes:editItem.notes })
      });
      await loadAttributes();
      setEditingId(null);
    } catch { setError("Update failed."); }
    setSaving(false);
  }

  async function handleDeleteAttr(id) {
    if (!confirm("Delete this attribute?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/home_attributes?id=eq.${id}`, {
      method:"DELETE",
      headers:{ ...HEADERS }
    });
    setItems(items.filter(i=>i.id!==id));
  }

  async function handleAddGrocery() {
    if (!newGrocery.item.trim()) return;
    setSaving(true);
    try {
      await sb("POST","groceries", { ...newGrocery, checked:false });
      await loadGroceries();
      setNewGrocery({ item:"", category:"General", added_by:"" });
      setShowAddGrocery(false);
    } catch { setError("Save failed."); }
    setSaving(false);
  }

  async function toggleGrocery(id, checked) {
    await fetch(`${SUPABASE_URL}/rest/v1/groceries?id=eq.${id}`, {
      method:"PATCH",
      headers:{ ...HEADERS },
      body: JSON.stringify({ checked: !checked })
    });
    setGroceries(groceries.map(g=>g.id===id?{...g,checked:!checked}:g));
  }

  async function deleteGrocery(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/groceries?id=eq.${id}`, {
      method:"DELETE",
      headers:{ ...HEADERS }
    });
    setGroceries(groceries.filter(g=>g.id!==id));
  }

  async function clearChecked() {
    const checked = groceries.filter(g=>g.checked);
    for (const g of checked) await deleteGrocery(g.id);
  }

  const filtered = items.filter(i =>
    (activeCat==="All"||i.category===activeCat) &&
    (priFilter==="All"||i.priority===priFilter) &&
    (srcFilter==="All"||i.source===srcFilter)
  );
  const grouped = CATEGORIES.map(cat=>({ cat, items:filtered.filter(i=>i.category===cat) })).filter(g=>g.items.length>0);
  const counts = { "Must Have":items.filter(i=>i.priority==="Must Have").length, "Want":items.filter(i=>i.priority==="Want").length, "Nice to Have":items.filter(i=>i.priority==="Nice to Have").length };

  if (screen==="home") return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#0f1a0f", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#4a7c4a", marginBottom:"8px" }}>Team Ween</div>
      <div style={{ fontSize:"36px", fontWeight:"bold", color:"#d4c9a0", letterSpacing:"1px", marginBottom:"4px" }}>WeenTeam Dashboard</div>
      <div style={{ fontSize:"13px", color:"#5a7a5a", marginBottom:"50px" }}>Shared Planning Dashboard</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"12px", width:"100%", maxWidth:"320px" }}>
        <DashCard icon="🏡" title="North Saanich" subtitle="Future Home Attributes" onClick={()=>setScreen("attributes")} />
        <DashCard icon="🛒" title="Groceries" subtitle="Shared running list" onClick={()=>setScreen("groceries")} />
        <DashCard icon="🎨" title="Interior Design" subtitle="Coming soon" disabled />
        <DashCard icon="⛷️" title="Golden Condo" subtitle="Coming soon" disabled />
      </div>
      <div style={{ marginTop:"40px", fontSize:"11px", color:"#3a5a3a", letterSpacing:"1px" }}>
        WEENTEAM · {new Date().getFullYear()}
      </div>
    </div>
  );

  if (screen==="groceries") {
    const unchecked = groceries.filter(g=>!g.checked);
    const checked = groceries.filter(g=>g.checked);
    return (
      <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#f8f6f0", minHeight:"100vh" }}>
        <div style={{ background:"#1a2a1a", color:"#d4c9a0", padding:"20px 24px 16px" }}>
          <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", padding:"0 0 8px 0", letterSpacing:"1px" }}>← DASHBOARD</button>
          <div style={{ fontSize:"22px", fontWeight:"bold" }}>Grocery List</div>
          <div style={{ fontSize:"12px", color:"#5a7a5a", marginTop:"2px" }}>{unchecked.length} items remaining{saving?" · Saving...":""}</div>
        </div>
        <div style={{ padding:"16px 24px", maxWidth:"600px" }}>
          {error && <div style={{ background:"#ffeaea", color:"#a03030", padding:"8px 12px", borderRadius:"4px", marginBottom:"12px", fontSize:"12px" }}>{error}</div>}
          {!showAddGrocery ? (
            <button onClick={()=>setShowAddGrocery(true)} style={{ ...BS, background:"#2d5a2d", color:"#fff", marginBottom:"16px" }}>+ Add Item</button>
          ) : (
            <div style={{ background:"#fff", border:"1px solid #d0c8b0", borderRadius:"5px", padding:"12px", marginBottom:"16px" }}>
              <input value={newGrocery.item} onChange={e=>setNewGrocery({...newGrocery,item:e.target.value})} placeholder="Item..." style={{...IS,width:"100%",marginBottom:"6px"}} onKeyDown={e=>e.key==="Enter"&&handleAddGrocery()} autoFocus />
              <div style={{ display:"flex", gap:"7px", marginBottom:"8px" }}>
                <select value={newGrocery.category} onChange={e=>setNewGrocery({...newGrocery,category:e.target.value})} style={SS}>{GROCERY_CATS.map(c=><option key={c}>{c}</option>)}</select>
                <input value={newGrocery.added_by} onChange={e=>setNewGrocery({...newGrocery,added_by:e.target.value})} placeholder="Added by..." style={{...IS,flex:1}} />
              </div>
              <div style={{ display:"flex", gap:"7px" }}>
                <button onClick={handleAddGrocery} disabled={saving} style={{...BS,background:"#2d5a2d",color:"#fff"}}>{saving?"Saving...":"Add"}</button>
                <button onClick={()=>setShowAddGrocery(false)} style={{...BS,background:"#eee",color:"#555"}}>Cancel</button>
              </div>
            </div>
          )}
          {loading && <div style={{ textAlign:"center", padding:"30px", color:"#7a8a7a" }}>Loading...</div>}
          {unchecked.map(g=>(
            <div key={g.id} style={{ background:"#fff", border:"1px solid #e0d8c0", borderRadius:"4px", padding:"10px 12px", marginBottom:"5px", display:"flex", alignItems:"center", gap:"10px" }}>
              <input type="checkbox" checked={false} onChange={()=>toggleGrocery(g.id,g.checked)} style={{ width:"16px", height:"16px", cursor:"pointer", accentColor:"#2d5a2d" }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"14px", color:"#1a2a1a" }}>{g.item}</div>
                <div style={{ fontSize:"11px", color:"#8a7a5a" }}>{g.category}{g.added_by?` · ${g.added_by}`:""}</div>
              </div>
              <button onClick={()=>deleteGrocery(g.id)} style={{ background:"none", border:"none", color:"#cc7a7a", cursor:"pointer", fontSize:"16px" }}>×</button>
            </div>
          ))}
          {checked.length>0 && (
            <div style={{ marginTop:"20px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#8a9a8a", textTransform:"uppercase", marginBottom:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>In Cart ({checked.length})</span>
                <button onClick={clearChecked} style={{ background:"none", border:"1px solid #c0b898", borderRadius:"3px", padding:"2px 8px", fontSize:"10px", color:"#8a7a5a", cursor:"pointer" }}>Clear all</button>
              </div>
              {checked.map(g=>(
                <div key={g.id} style={{ background:"#f0ece4", border:"1px solid #e0d8c0", borderRadius:"4px", padding:"10px 12px", marginBottom:"4px", display:"flex", alignItems:"center", gap:"10px", opacity:0.6 }}>
                  <input type="checkbox" checked={true} onChange={()=>toggleGrocery(g.id,g.checked)} style={{ width:"16px", height:"16px", cursor:"pointer", accentColor:"#2d5a2d" }} />
                  <div style={{ flex:1, textDecoration:"line-through" }}>
                    <div style={{ fontSize:"14px", color:"#5a6a5a" }}>{g.item}</div>
                  </div>
                  <button onClick={()=>deleteGrocery(g.id)} style={{ background:"none", border:"none", color:"#cc7a7a", cursor:"pointer", fontSize:"16px" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#f8f6f0", minHeight:"100vh" }}>
      <style>{`@media print { .no-print{display:none!important} .item-row{break-inside:avoid} }`}</style>
      <div className="no-print" style={{ background:"#1a2a1a", color:"#d4c9a0", padding:"20px 24px 14px", borderBottom:"3px solid #4a7c4a" }}>
        <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", padding:"0 0 6px 0", letterSpacing:"1px" }}>← DASHBOARD</button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"8px" }}>
          <div>
            <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#5a7a5a" }}>North Saanich, BC</div>
            <div style={{ fontSize:"22px", fontWeight:"bold" }}>Future Home Attributes</div>
            <div style={{ fontSize:"12px", color:"#5a7a5a", marginTop:"1px" }}>
              {loading?"Loading...":seeding?"Seeding data...":`${items.length} attributes · Supabase`}
              {saving&&<span style={{color:"#ccaa6d",marginLeft:"8px"}}>Saving...</span>}
            </div>
          </div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            <button onClick={loadAttributes} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}}>↻ Refresh</button>
            <button onClick={()=>window.print()} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}}>Print</button>
            {items.length===0&&!loading&&(
              <button onClick={seedData} disabled={seeding} style={{...BS,background:"#4a7c4a",color:"#fff"}}>
                {seeding?"Loading 77 items...":"Load All Attributes"}
              </button>
            )}
          </div>
        </div>
        {error&&<div style={{background:"#5a1a1a",color:"#ffaaaa",padding:"7px 12px",borderRadius:"4px",marginTop:"10px",fontSize:"12px"}}>{error}</div>}
        <div style={{ display:"flex", gap:"8px", marginTop:"12px", flexWrap:"wrap", alignItems:"center" }}>
          {Object.entries(counts).map(([p,n])=>(
            <div key={p} onClick={()=>setPriFilter(priFilter===p?"All":p)}
              style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"3px",padding:"4px 10px",fontSize:"11px",cursor:"pointer",opacity:priFilter==="All"||priFilter===p?1:0.35,transition:"opacity 0.2s"}}>
              <span style={{color:PC[p].chip}}>{n}</span>
              <span style={{color:"#8a9c8a",marginLeft:"5px"}}>{p}</span>
            </div>
          ))}
          <div style={{width:"1px",height:"14px",background:"rgba(255,255,255,0.15)"}}/>
          {SOURCES.map(s=>(
            <div key={s} onClick={()=>setSrcFilter(srcFilter===s?"All":s)}
              style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"3px",padding:"4px 10px",fontSize:"11px",cursor:"pointer",opacity:srcFilter==="All"||srcFilter===s?1:0.35,transition:"opacity 0.2s"}}>
              <span style={{color:SC[s].color}}>{items.filter(i=>i.source===s).length}</span>
              <span style={{color:"#8a9c8a",marginLeft:"5px"}}>{s}</span>
            </div>
          ))}
          {(priFilter!=="All"||srcFilter!=="All")&&<span onClick={()=>{setPriFilter("All");setSrcFilter("All");}} style={{color:"#7a9c7a",fontSize:"11px",cursor:"pointer",textDecoration:"underline"}}>clear</span>}
        </div>
      </div>
      <div className="no-print" style={{ background:"#2a3a2a", padding:"0 24px", display:"flex", overflowX:"auto", borderBottom:"2px solid #3a5a3a" }}>
        {["All",...CATEGORIES].map(cat=>(
          <button key={cat} onClick={()=>setActiveCat(cat)} style={{
            background:"none",border:"none",
            borderBottom:activeCat===cat?"2px solid #7dbb7d":"2px solid transparent",
            color:activeCat===cat?"#d4c9a0":"#5a7a5a",
            padding:"8px 10px",fontSize:"10px",letterSpacing:"0.5px",cursor:"pointer",whiteSpace:"nowrap",marginBottom:"-2px"
          }}>
            {cat==="All"?`ALL (${items.length})`:`${cat.split(" & ")[0].split(" /")[0].toUpperCase()} (${items.filter(i=>i.category===cat).length})`}
          </button>
        ))}
      </div>
      <div style={{ padding:"18px 24px", maxWidth:"960px" }}>
        {!loading&&(
          <div className="no-print" style={{marginBottom:"14px"}}>
            {!showAdd?(
              <button onClick={()=>setShowAdd(true)} style={{...BS,background:"#2d5a2d",color:"#d4c9a0"}}>+ Add Attribute</button>
            ):(
              <div style={{background:"#fff",border:"1px solid #c0b898",borderRadius:"5px",padding:"13px"}}>
                <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"7px"}}>
                  <select value={newItem.category} onChange={e=>setNewItem({...newItem,category:e.target.value})} style={SS}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                  <select value={newItem.priority} onChange={e=>setNewItem({...newItem,priority:e.target.value})} style={SS}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
                  <select value={newItem.source} onChange={e=>setNewItem({...newItem,source:e.target.value})} style={SS}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select>
                  <select value={newItem.status} onChange={e=>setNewItem({...newItem,status:e.target.value})} style={SS}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
                </div>
                <input value={newItem.text} onChange={e=>setNewItem({...newItem,text:e.target.value})} placeholder="Attribute description..." style={{...IS,width:"100%",marginBottom:"6px"}} onKeyDown={e=>e.key==="Enter"&&handleAddAttr()} />
                <input value={newItem.notes} onChange={e=>setNewItem({...newItem,notes:e.target.value})} placeholder="Notes (optional)..." style={{...IS,width:"100%",fontSize:"12px",marginBottom:"9px"}} />
                <div style={{display:"flex",gap:"7px"}}>
                  <button onClick={handleAddAttr} disabled={saving} style={{...BS,background:"#2d5a2d",color:"#fff"}}>{saving?"Saving...":"Save"}</button>
                  <button onClick={()=>setShowAdd(false)} style={{...BS,background:"#eee",color:"#555"}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        {loading&&<div style={{textAlign:"center",padding:"40px",color:"#7a8a7a"}}>Loading from Supabase...</div>}
        {!loading&&items.length===0&&(
          <div style={{textAlign:"center",padding:"40px",color:"#7a8a7a"}}>
            <div style={{fontSize:"14px",marginBottom:"12px"}}>No attributes yet.</div>
            <button onClick={seedData} disabled={seeding} style={{...BS,background:"#2d5a2d",color:"#fff",fontSize:"13px",padding:"10px 24px"}}>
              {seeding?"Loading 77 items — please wait...":"Load All 77 Attributes"}
            </button>
          </div>
        )}
        {grouped.map(({cat,items:catItems})=>(
          <div key={cat} style={{marginBottom:"20px"}}>
            <div style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#5a7a5a",borderBottom:"1px solid #d0c8b0",paddingBottom:"4px",marginBottom:"8px"}}>
              {cat} <span style={{color:"#9a8a5a"}}>({catItems.length})</span>
            </div>
            {catItems.map(item=>{
              const pc=PC[item.priority]||PC["Want"];
              const sc=SC[item.source]||SC["Existing"];
              const isEditing=editingId===item.id;
              return (
                <div key={item.id} className="item-row" style={{background:isEditing?"#fffef8":"#fff",border:`1px solid ${isEditing?"#c8a832":"#e0d8c0"}`,borderLeft:`3px solid ${pc.border}`,borderRadius:"4px",padding:"9px 11px",marginBottom:"5px"}}>
                  {isEditing?(
                    <div>
                      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"7px"}}>
                        <select value={editItem.category} onChange={e=>setEditItem({...editItem,category:e.target.value})} style={SS}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                        <select value={editItem.priority} onChange={e=>setEditItem({...editItem,priority:e.target.value})} style={SS}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
                        <select value={editItem.source} onChange={e=>setEditItem({...editItem,source:e.target.value})} style={SS}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select>
                        <select value={editItem.status||""} onChange={e=>setEditItem({...editItem,status:e.target.value})} style={SS}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
                      </div>
                      <input value={editItem.text} onChange={e=>setEditItem({...editItem,text:e.target.value})} style={{...IS,width:"100%",marginBottom:"5px"}} />
                      <input value={editItem.notes||""} onChange={e=>setEditItem({...editItem,notes:e.target.value})} placeholder="Notes..." style={{...IS,width:"100%",fontSize:"12px",marginBottom:"8px"}} />
                      <div style={{display:"flex",gap:"7px"}}>
                        <button onClick={handleUpdateAttr} disabled={saving} style={{...BS,background:"#2d5a2d",color:"#fff"}}>{saving?"Saving...":"Save"}</button>
                        <button onClick={()=>setEditingId(null)} style={{...BS,background:"#eee",color:"#555"}}>Cancel</button>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"flex-start",gap:"7px"}}>
                      <span style={{background:pc.badge,color:"#fff",fontSize:"8px",letterSpacing:"0.8px",padding:"2px 5px",borderRadius:"2px",whiteSpace:"nowrap",marginTop:"3px",flexShrink:0}}>{pc.label}</span>
                      <span style={{color:sc.color,fontSize:"8px",letterSpacing:"0.8px",padding:"2px 5px",borderRadius:"2px",border:`1px solid ${sc.color}`,whiteSpace:"nowrap",marginTop:"3px",flexShrink:0}}>{sc.label}</span>
                      {item.status&&item.status!=="Under Discussion"&&(
                        <span style={{color:"#2d7a4a",fontSize:"8px",letterSpacing:"0.8px",padding:"2px 5px",borderRadius:"2px",border:"1px solid #2d7a4a",whiteSpace:"nowrap",marginTop:"3px",flexShrink:0}}>{item.status.toUpperCase()}</span>
                      )}
                      <div style={{flex:1}}>
                        <div style={{fontSize:"13px",color:"#1a2a1a",lineHeight:"1.4"}}>{item.text}</div>
                        {item.notes&&<div style={{fontSize:"11px",color:"#7a6a4a",marginTop:"2px",fontStyle:"italic"}}>{item.notes}</div>}
                      </div>
                      <div className="no-print" style={{display:"flex",gap:"4px",flexShrink:0}}>
                        <button onClick={()=>{setEditingId(item.id);setEditItem({...item});}} style={IB}>✎</button>
                        <button onClick={()=>handleDeleteAttr(item.id)} style={{...IB,color:"#a05050"}}>×</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashCard({ icon, title, subtitle, onClick, disabled }) {
  return (
    <div onClick={disabled?undefined:onClick} style={{
      background: disabled?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.06)",
      border: `1px solid ${disabled?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.12)"}`,
      borderRadius:"8px", padding:"18px 20px", cursor:disabled?"default":"pointer",
      display:"flex", alignItems:"center", gap:"14px",
      opacity: disabled?0.4:1, transition:"all 0.2s",
    }}
    onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
    onMouseLeave={e=>{ if(!disabled) e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}>
      <div style={{fontSize:"24px"}}>{icon}</div>
      <div>
        <div style={{fontSize:"15px",fontWeight:"bold",color:"#d4c9a0"}}>{title}</div>
        <div style={{fontSize:"11px",color:"#5a7a5a",marginTop:"2px"}}>{subtitle}</div>
      </div>
      {!disabled&&<div style={{marginLeft:"auto",color:"#4a7c4a",fontSize:"18px"}}>›</div>}
    </div>
  );
}

const BS = { border:"none", borderRadius:"3px", padding:"6px 14px", fontSize:"11px", letterSpacing:"0.5px", cursor:"pointer", fontFamily:"Georgia,serif", textTransform:"uppercase" };
const SS = { background:"#f8f6f0", border:"1px solid #c0b898", borderRadius:"3px", padding:"4px 7px", fontSize:"11px", color:"#1a2a1a", fontFamily:"Georgia,serif" };
const IS = { background:"#f8f6f0", border:"1px solid #c0b898", borderRadius:"3px", padding:"5px 9px", fontSize:"13px", color:"#1a2a1a", fontFamily:"Georgia,serif", boxSizing:"border-box" };
const IB = { background:"none", border:"none", cursor:"pointer", fontSize:"15px", color:"#6a8a6a", padding:"1px 3px", lineHeight:1 };