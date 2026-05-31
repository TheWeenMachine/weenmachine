import { useState, useEffect } from "react";

const SUPABASE_URL = "https://uiqexanfeusvfgntflhm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWV4YW5mZXVzdmZnbnRmbGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzAwODMsImV4cCI6MjA5NTgwNjA4M30.-dPrl7J1wDG_iSw09KdIqqVIlQGYGaP6nsj6Ffnfp0k";

const VI_CATEGORIES = [
  "Site & Location","Architecture & Exterior","Structure & Size",
  "Water & Marine","Gym & Fitness / Wellness","Kitchen & Scullery",
  "Interior Finishes & Style","Primary Suite","Outdoor & Landscape",
  "Smart Home & Systems","Infrastructure & Mechanical","Nice to Have"
];
const RV_CATEGORIES = [
  "Building & Unit","Ski Access & Mountain","Storage & Parking",
  "Layout & Size","Kitchen & Living","Primary Suite",
  "Rental Potential","Amenities & Building","Financial","Nice to Have"
];
const PRIORITIES = ["Must Have","Want","Nice to Have"];
const SOURCES = ["Existing","2026 Trend"];
const STATUSES = ["Under Discussion","Confirmed","Rejected","Deferred"];
const GROCERY_CATS = ["Dairy & Milk","Cheese","Yogurt & Breakfast","Deli Meats","Meat","Produce & Frozen","Chips & Crackers","Dips & Spreads","Nuts & Bars","Pantry","Teas","Toiletries","Other"];

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

async function sb(method, table, body) {
  const base = `${SUPABASE_URL}/rest/v1/${table}`;
  const url = method === "GET" ? `${base}?order=created_at.asc&limit=500` : base;
  const res = await fetch(url, {
    method,
    headers: { ...HEADERS, "Prefer": method === "POST" ? "return=representation" : "return=minimal" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (method === "GET") return res.json();
  if (!res.ok) { const t = await res.text(); throw new Error(t); }
  return true;
}

const VI_SEED = [
  { text:"Waterfront — ocean frontage, Saanich Peninsula", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Primary driver of the BC move" },
  { text:"Deep Cove / North Saanich neighbourhood", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"R-2 zoning, low density, quiet marine community" },
  { text:"Private lot — minimal visible neighbours", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"South or SW facing water views", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Light quality, afternoon sun" },
  { text:"Lot size sufficient for detached gym (~1,098 sq ft accessory, R-2 max)", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Confirmed permitted under North Saanich Bylaw 1255" },
  { text:"Deep water moorage or mooring buoy access", category:"Site & Location", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Required for Pursuit OS 355 — Van Isle Marina fallback" },
  { text:"Walking distance / short drive to Sidney marine services", category:"Site & Location", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Northwest Contemporary — clean lines, deep overhangs, expansive glass", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Dominant 2026 PNW style" },
  { text:"Retractable glass facade / folding glass walls to outdoor living", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Most-requested feature in 2026 Vancouver luxury renovations" },
  { text:"Deep covered veranda / outdoor room — heated, functional year-round", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Natural material exterior — reclaimed wood, natural stone, weathering metal", category:"Architecture & Exterior", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Black architectural accents — posts, trim, beams", category:"Architecture & Exterior", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Green roof or living wall section", category:"Architecture & Exterior", priority:"Nice to Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"4,000+ sq ft main house", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"4+ bedrooms (guest capacity)", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Dedicated home office with water view", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"AI workflow, market monitoring, Q Lab Python work" },
  { text:"3+ car garage (EV-ready)", category:"Structure & Size", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Defender Octa + daily driver + spare" },
  { text:"Main-floor primary suite (aging-in-place planning)", category:"Structure & Size", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Longevity lens" },
  { text:"Dedicated gear/mudroom — fishing, ski, marine, outdoor kit storage", category:"Structure & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Private dock or foreshore suitable for dock construction", category:"Water & Marine", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Critical for OS 355 home-port option" },
  { text:"Covered boathouse or winter moorage capability", category:"Water & Marine", priority:"Want", source:"Existing", status:"Under Discussion", notes:"OS 355 all-weather storage" },
  { text:"Beach / foreshore access", category:"Water & Marine", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Multisensory waterfront deck — fire, lighting, audio, seasonal dining", category:"Water & Marine", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Detached gym building 800-1098 sq ft, high ceilings 12 ft+", category:"Gym & Fitness / Wellness", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Vasper, Peloton, BFR, strength — dedicated power + HVAC required" },
  { text:"Gym with water view or direct natural light", category:"Gym & Fitness / Wellness", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Dedicated wellness circuit: sauna to cold plunge to rest zone", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"Fire and Ice recovery circuit" },
  { text:"Circadian lighting system throughout home", category:"Gym & Fitness / Wellness", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Open-plan kitchen / great room facing water", category:"Kitchen & Scullery", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Quiet luxury palette: white oak or walnut cabinetry, warm earthy neutrals", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Waterfall island — natural stone, honed or leathered finish", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Fully integrated / concealed appliances", category:"Kitchen & Scullery", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Walk-in pantry / scullery behind main kitchen", category:"Kitchen & Scullery", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Sub-Zero / Wolf / Miele or Fisher and Paykel appliance tier", category:"Kitchen & Scullery", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Wine storage — dedicated temperature-controlled", category:"Kitchen & Scullery", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Limewash walls — tone shifts with light", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Warm earthy palette — mushroom, taupe, greige, soft clay, muted green", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Brushed brass / oil-rubbed bronze / warm black hardware", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Biophilic design — indoor living walls, botanical elements", category:"Interior Finishes & Style", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Media room / home theatre", category:"Interior Finishes & Style", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Large primary suite — water view, main floor", category:"Primary Suite", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Hotel-inspired bathroom — wellness retreat", category:"Primary Suite", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Freestanding soaker tub with water view", category:"Primary Suite", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Architecture-first outdoor master plan — dining, lounging, wellness, fire zones", category:"Outdoor & Landscape", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Covered heated outdoor kitchen", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Heated pool / lap pool with integrated spa", category:"Outdoor & Landscape", priority:"Want", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Whole-home smart integration — voice/app climate, lighting, security, audio", category:"Smart Home & Systems", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"" },
  { text:"Security with facial recognition / advanced monitoring", category:"Smart Home & Systems", priority:"Must Have", source:"2026 Trend", status:"Under Discussion", notes:"Extended absences make this critical" },
  { text:"Whole-home audio indoor + outdoor", category:"Smart Home & Systems", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Backup generator — whole-home", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Island power reliability" },
  { text:"Fibre internet", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"EV charging — Level 2 minimum, ideally dual", category:"Infrastructure & Mechanical", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Defender Octa + second vehicle" },
  { text:"Heat pump + radiant in-floor heating", category:"Infrastructure & Mechanical", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Seaplane float or proximity to Harbour Air", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Guest cottage / carriage house", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Helicopter pad or pad-suitable area", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
];

const RV_SEED = [
  { text:"Minimum 3 bed / 3 bath", category:"Layout & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Townhome or condo format (not detached)", category:"Building & Unit", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Lower maintenance, lock-and-leave friendly" },
  { text:"Top floor or upper floors preferred — views and quiet", category:"Building & Unit", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Corner unit or end unit — extra light and privacy", category:"Building & Unit", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Secure building with concierge or keypad access", category:"Building & Unit", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Lock-and-leave security" },
  { text:"Ski-in / ski-out or short ski-out access", category:"Ski Access & Mountain", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Kicking Horse preferred" },
  { text:"Ski locker / boot dryer in building or unit", category:"Ski Access & Mountain", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Mountain views from primary living area", category:"Ski Access & Mountain", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Proximity to village / ski hill base services", category:"Ski Access & Mountain", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Restaurants, rentals, apres" },
  { text:"Underground or heated parking — minimum 1 stall", category:"Storage & Parking", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Storage locker for gear (skis, bikes, outdoor equipment)", category:"Storage & Parking", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"EV charging in parkade or dedicated stall", category:"Storage & Parking", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Open-plan kitchen / living area — mountain aesthetic", category:"Layout & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Private outdoor space — deck or patio with mountain views", category:"Layout & Size", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"1,200+ sq ft preferred", category:"Layout & Size", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Enough for two couples comfortably" },
  { text:"Gas fireplace or wood stove — mountain ambiance", category:"Kitchen & Living", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Fully equipped kitchen — not builder-grade", category:"Kitchen & Living", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Warm mountain palette — wood tones, stone, dark accents", category:"Kitchen & Living", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"In-unit laundry", category:"Kitchen & Living", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Primary suite with ensuite bath", category:"Primary Suite", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Soaker tub or steam shower in primary ensuite", category:"Primary Suite", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Strong short-term rental market / Airbnb-friendly strata", category:"Rental Potential", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"Offset carry costs" },
  { text:"Property management available in building", category:"Rental Potential", priority:"Want", source:"Existing", status:"Under Discussion", notes:"Hands-off rental when not in use" },
  { text:"Rental history or projected income data available", category:"Rental Potential", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Hot tub — building or unit level", category:"Amenities & Building", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Fitness room or gym in building", category:"Amenities & Building", priority:"Want", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Reasonable strata fees relative to amenities", category:"Financial", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" },
  { text:"Well-funded strata reserve fund", category:"Financial", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"No special assessments surprise" },
  { text:"Target purchase price CAD $900K - $1.25M", category:"Financial", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"~$680K-$940K USD at 1.325" },
  { text:"Bike storage for summer use", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"Revelstoke has world-class mountain biking" },
  { text:"Rooftop access or shared view terrace", category:"Nice to Have", priority:"Nice to Have", source:"Existing", status:"Under Discussion", notes:"" },
];

const GROCERY_SEED = [
  { item:"Soy Milk", category:"Dairy & Milk", checked:false, added_by:"" },
  { item:"Almond Milk", category:"Dairy & Milk", checked:false, added_by:"" },
  { item:"Half & Half", category:"Dairy & Milk", checked:false, added_by:"" },
  { item:"Creamer", category:"Dairy & Milk", checked:false, added_by:"" },
  { item:"Buttermilk", category:"Dairy & Milk", checked:false, added_by:"" },
  { item:"Cream Cheese", category:"Cheese", checked:false, added_by:"" },
  { item:"Babybel", category:"Cheese", checked:false, added_by:"" },
  { item:"Cottage Cheese", category:"Cheese", checked:false, added_by:"" },
  { item:"Cheese Crisps", category:"Cheese", checked:false, added_by:"" },
  { item:"Xtra Crispy Cheez-It", category:"Cheese", checked:false, added_by:"" },
  { item:"Pre-mixed Yogurt (Brown Cow & Siggi's)", category:"Yogurt & Breakfast", checked:false, added_by:"" },
  { item:"Cream of Wheat", category:"Yogurt & Breakfast", checked:false, added_by:"" },
  { item:"Eggs", category:"Yogurt & Breakfast", checked:false, added_by:"" },
  { item:"Bagels", category:"Yogurt & Breakfast", checked:false, added_by:"" },
  { item:"Ham", category:"Deli Meats", checked:false, added_by:"" },
  { item:"Roast Beef", category:"Deli Meats", checked:false, added_by:"" },
  { item:"Chicken Thighs", category:"Meat", checked:false, added_by:"" },
  { item:"Steaks", category:"Meat", checked:false, added_by:"" },
  { item:"Avocado", category:"Produce & Frozen", checked:false, added_by:"" },
  { item:"Frozen Fruit", category:"Produce & Frozen", checked:false, added_by:"" },
  { item:"Potato Chips", category:"Chips & Crackers", checked:false, added_by:"" },
  { item:"Tortilla Chips", category:"Chips & Crackers", checked:false, added_by:"" },
  { item:"French Onion Dip", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Bean Dip", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Mayonnaise", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Crunchy Peanut Butter", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Honey", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Hot Fudge", category:"Dips & Spreads", checked:false, added_by:"" },
  { item:"Marcona Almonds (salted)", category:"Nuts & Bars", checked:false, added_by:"" },
  { item:"Pistachios (salted)", category:"Nuts & Bars", checked:false, added_by:"" },
  { item:"Aloha Bars", category:"Nuts & Bars", checked:false, added_by:"" },
  { item:"Rayo's Tomato Sauce", category:"Pantry", checked:false, added_by:"" },
  { item:"Dishwashing Detergent", category:"Pantry", checked:false, added_by:"" },
  { item:"Peppermint Herbal Tea", category:"Teas", checked:false, added_by:"" },
  { item:"Lemon Ginger Tea", category:"Teas", checked:false, added_by:"" },
  { item:"Chamomile Herbal Tea", category:"Teas", checked:false, added_by:"" },
  { item:"Antiperspirant", category:"Toiletries", checked:false, added_by:"" },
  { item:"Crest Pro White", category:"Toiletries", checked:false, added_by:"" },
];

const BS = { border:"none", borderRadius:"3px", padding:"6px 14px", fontSize:"11px", letterSpacing:"0.5px", cursor:"pointer", fontFamily:"Georgia,serif", textTransform:"uppercase" };
const SS = { background:"#f8f6f0", border:"1px solid #c0b898", borderRadius:"3px", padding:"4px 7px", fontSize:"11px", color:"#1a2a1a", fontFamily:"Georgia,serif" };
const IS = { background:"#f8f6f0", border:"1px solid #c0b898", borderRadius:"3px", padding:"5px 9px", fontSize:"13px", color:"#1a2a1a", fontFamily:"Georgia,serif", boxSizing:"border-box" };
const IB = { background:"none", border:"none", cursor:"pointer", fontSize:"15px", color:"#6a8a6a", padding:"1px 3px", lineHeight:1 };

export default function WeenTeam() {
  const [screen, setScreen] = useState("home");
  const [items, setItems] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedingGroceries, setSeedingGroceries] = useState(false);
  const [error, setError] = useState(null);
  const [activeCat, setActiveCat] = useState("All");
  const [priFilter, setPriFilter] = useState("All");
  const [srcFilter, setSrcFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({ text:"", category:"", priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" });
  const [editItem, setEditItem] = useState({});
  const [newGrocery, setNewGrocery] = useState({ item:"", category:GROCERY_CATS[0], added_by:"" });
  const [showAddGrocery, setShowAddGrocery] = useState(false);
  const [addingToCat, setAddingToCat] = useState(null);
  const [quickItem, setQuickItem] = useState("");
  const [viPrice, setViPrice] = useState({ min:"$3.5M", max:"$4.5M", editing:false });
  const [rvPrice, setRvPrice] = useState({ min:"CAD $900K", max:"CAD $1.25M", editing:false });
  const [viPriceDraft, setViPriceDraft] = useState({ min:"", max:"" });
  const [rvPriceDraft, setRvPriceDraft] = useState({ min:"", max:"" });

  const isVI = screen === "vi_attributes";
  const isRV = screen === "rv_attributes";
  const currentCategories = isRV ? RV_CATEGORIES : VI_CATEGORIES;
  const currentTable = isRV ? "rv_attributes" : "home_attributes";
  const currentSeed = isRV ? RV_SEED : VI_SEED;

  useEffect(() => {
    if (isVI || isRV) loadAttributes();
    if (screen === "groceries") loadGroceries();
  }, [screen]);

  async function loadAttributes() {
    setLoading(true); setError(null); setActiveCat("All"); setPriFilter("All"); setSrcFilter("All");
    try { setItems(await sb("GET", currentTable)); }
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
      for (const item of currentSeed) { await sb("POST", currentTable, item); }
      await loadAttributes();
    } catch(e) { setError("Seed failed: " + e.message); }
    setSeeding(false);
  }

  async function seedGroceries() {
    setSeedingGroceries(true); setError(null);
    try {
      for (const item of GROCERY_SEED) { await sb("POST","groceries", item); }
      await loadGroceries();
    } catch(e) { setError("Grocery seed failed: " + e.message); }
    setSeedingGroceries(false);
  }

  async function handleAddAttr() {
    if (!newItem.text.trim()) return;
    setSaving(true);
    try {
      await sb("POST", currentTable, newItem);
      await loadAttributes();
      setNewItem({ text:"", category:currentCategories[0], priority:"Must Have", source:"Existing", status:"Under Discussion", notes:"" });
      setShowAdd(false);
    } catch { setError("Save failed."); }
    setSaving(false);
  }

  async function handleUpdateAttr() {
    setSaving(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/${currentTable}?id=eq.${editingId}`, {
        method:"PATCH", headers:{ ...HEADERS },
        body: JSON.stringify({ text:editItem.text, category:editItem.category, priority:editItem.priority, source:editItem.source, status:editItem.status, notes:editItem.notes })
      });
      await loadAttributes();
      setEditingId(null);
    } catch { setError("Update failed."); }
    setSaving(false);
  }

  async function handleDeleteAttr(id) {
    if (!confirm("Delete this attribute?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/${currentTable}?id=eq.${id}`, { method:"DELETE", headers:{ ...HEADERS } });
    setItems(items.filter(i=>i.id!==id));
  }

  async function handleAddGrocery() {
    if (!newGrocery.item.trim()) return;
    setSaving(true);
    try {
      await sb("POST","groceries", { ...newGrocery, checked:false });
      await loadGroceries();
      setNewGrocery({ item:"", category:GROCERY_CATS[0], added_by:"" });
      setShowAddGrocery(false);
    } catch { setError("Save failed."); }
    setSaving(false);
  }

  async function handleQuickAdd(cat) {
    if (!quickItem.trim()) return;
    setSaving(true);
    try {
      await sb("POST","groceries", { item:quickItem.trim(), category:cat, checked:false, added_by:"" });
      await loadGroceries();
      setQuickItem("");
      setAddingToCat(null);
    } catch { setError("Save failed."); }
    setSaving(false);
  }

  async function toggleGrocery(id, checked) {
    await fetch(`${SUPABASE_URL}/rest/v1/groceries?id=eq.${id}`, {
      method:"PATCH", headers:{ ...HEADERS },
      body: JSON.stringify({ checked: !checked })
    });
    setGroceries(groceries.map(g=>g.id===id?{...g,checked:!checked}:g));
  }

  async function deleteGrocery(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/groceries?id=eq.${id}`, { method:"DELETE", headers:{ ...HEADERS } });
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
  const grouped = currentCategories.map(cat=>({ cat, items:filtered.filter(i=>i.category===cat) })).filter(g=>g.items.length>0);
  const counts = { "Must Have":items.filter(i=>i.priority==="Must Have").length, "Want":items.filter(i=>i.priority==="Want").length, "Nice to Have":items.filter(i=>i.priority==="Nice to Have").length };

  // ── HOME ──────────────────────────────────────────────────
  if (screen==="home") return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#0f1a0f", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#4a7c4a", marginBottom:"8px" }}>Team Ween</div>
      <div style={{ fontSize:"36px", fontWeight:"bold", color:"#d4c9a0", letterSpacing:"1px", marginBottom:"4px" }}>WeenTeam Dashboard</div>
      <div style={{ fontSize:"13px", color:"#5a7a5a", marginBottom:"44px" }}>Shared Planning Dashboard</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"340px" }}>
        <DashCard icon="🏠" title="Real Estate" subtitle="Vancouver Island · Revelstoke" onClick={()=>setScreen("real_estate")} accent="#4a7c4a" />
        <DashCard icon="🎨" title="Interior Design" subtitle="Vancouver Island · Revelstoke" onClick={()=>setScreen("interior_design")} accent="#7a4a9c" />
        <DashCard icon="🛒" title="Groceries" subtitle="Shared running list" onClick={()=>setScreen("groceries")} accent="#9c7a4a" />
      </div>
      <div style={{ marginTop:"40px", fontSize:"11px", color:"#3a5a3a", letterSpacing:"1px" }}>WEENTEAM · {new Date().getFullYear()}</div>
    </div>
  );

  // ── REAL ESTATE HUB ───────────────────────────────────────
  if (screen==="real_estate") return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#0f1a0f", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", letterSpacing:"1px", marginBottom:"24px", alignSelf:"flex-start", marginLeft:"calc(50% - 170px)" }}>← DASHBOARD</button>
      <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#4a7c4a", marginBottom:"6px" }}>Real Estate</div>
      <div style={{ fontSize:"28px", fontWeight:"bold", color:"#d4c9a0", marginBottom:"6px" }}>Properties</div>
      <div style={{ fontSize:"13px", color:"#5a7a5a", marginBottom:"40px" }}>Select a property to view attributes</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"340px" }}>
        <PropertyCard
          icon="🌊" title="Vancouver Island" subtitle="Waterfront · North Saanich, BC"
          priceMin={viPrice.min} priceMax={viPrice.max}
          count={null} accent="#4a7c4a"
          onClick={()=>setScreen("vi_attributes")} />
        <PropertyCard
          icon="⛷️" title="Revelstoke" subtitle="Ski Condo · Revelstoke, BC"
          priceMin={rvPrice.min} priceMax={rvPrice.max}
          count={null} accent="#5a7aac"
          onClick={()=>setScreen("rv_attributes")} />
      </div>
    </div>
  );

  // ── INTERIOR DESIGN HUB ───────────────────────────────────
  if (screen==="interior_design") return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#0f1a0f", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", letterSpacing:"1px", marginBottom:"24px", alignSelf:"flex-start", marginLeft:"calc(50% - 170px)" }}>← DASHBOARD</button>
      <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#7a4a9c", marginBottom:"6px" }}>Interior Design</div>
      <div style={{ fontSize:"28px", fontWeight:"bold", color:"#d4c9a0", marginBottom:"6px" }}>Design Boards</div>
      <div style={{ fontSize:"13px", color:"#5a7a5a", marginBottom:"40px" }}>Separate vision for each property</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"340px" }}>
        <DashCard icon="🌊" title="Vancouver Island" subtitle="Beach Home · Coming Soon" disabled accent="#4a7c4a" />
        <DashCard icon="⛷️" title="Revelstoke" subtitle="Mountain Home · Coming Soon" disabled accent="#5a7aac" />
      </div>
    </div>
  );

  // ── GROCERIES ─────────────────────────────────────────────
  if (screen==="groceries") {
    const unchecked = groceries.filter(g=>!g.checked);
    const checked = groceries.filter(g=>g.checked);
    const groupedGroceries = GROCERY_CATS.map(cat=>({ cat, items: unchecked.filter(g=>g.category===cat) })).filter(g=>g.items.length>0);
    const uncategorized = unchecked.filter(g=>!GROCERY_CATS.includes(g.category));
    return (
      <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#f8f6f0", minHeight:"100vh" }}>
        <div style={{ background:"#1a2a1a", color:"#d4c9a0", padding:"20px 24px 16px" }}>
          <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", padding:"0 0 8px 0", letterSpacing:"1px" }}>← DASHBOARD</button>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:"22px", fontWeight:"bold" }}>Grocery List</div>
              <div style={{ fontSize:"12px", color:"#5a7a5a", marginTop:"2px" }}>{unchecked.length} to get · {checked.length} in cart{saving?" · Saving...":""}</div>
            </div>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              <button onClick={loadGroceries} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}}>↻</button>
              {checked.length>0&&<button onClick={clearChecked} style={{...BS,background:"#7c2d2d",color:"#fff"}}>Clear Cart ({checked.length})</button>}
            </div>
          </div>
        </div>

        {/* In Cart panel — top, always visible when items checked */}
        {checked.length>0&&(
          <div style={{ background:"#2d4a2d", borderBottom:"2px solid #4a7c4a", padding:"12px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#7dbb7d", fontWeight:"bold" }}>
                🛒 In Cart — {checked.length} item{checked.length!==1?"s":""}
              </div>
              <button onClick={clearChecked} style={{...BS,background:"#7c2d2d",color:"#fff",padding:"3px 10px",fontSize:"10px"}}>Clear All</button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {checked.map(g=>(
                <div key={g.id} style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"20px", padding:"4px 10px 4px 8px", display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ fontSize:"13px", color:"#d4c9a0" }}>{g.item}</span>
                  <button onClick={()=>toggleGrocery(g.id,g.checked)} style={{ background:"none", border:"none", color:"#7dbb7d", cursor:"pointer", fontSize:"14px", padding:"0", lineHeight:1 }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ padding:"16px 24px", maxWidth:"640px" }}>
          {error&&<div style={{background:"#ffeaea",color:"#a03030",padding:"8px 12px",borderRadius:"4px",marginBottom:"12px",fontSize:"12px"}}>{error}</div>}
          {loading&&<div style={{textAlign:"center",padding:"30px",color:"#7a8a7a"}}>Loading...</div>}
          {!loading&&groceries.length===0&&(
            <div style={{textAlign:"center",padding:"30px",color:"#7a8a7a"}}>
              <div style={{marginBottom:"12px",fontSize:"13px"}}>No groceries yet.</div>
              <button onClick={seedGroceries} disabled={seedingGroceries} style={{...BS,background:"#2d5a2d",color:"#fff",fontSize:"13px",padding:"10px 24px"}}>
                {seedingGroceries?"Loading list...":"Load My Grocery List"}
              </button>
            </div>
          )}
          {groupedGroceries.map(({cat,items:catItems})=>(
            <div key={cat} style={{marginBottom:"18px"}}>
              <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a7a5a",borderBottom:"1px solid #d0c8b0",paddingBottom:"4px",marginBottom:"8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{cat} <span style={{color:"#9a8a5a"}}>({catItems.length})</span></span>
                <button onClick={()=>setAddingToCat(addingToCat===cat?null:cat)} style={{background:"none",border:"none",color:"#4a7c4a",fontSize:"11px",cursor:"pointer",letterSpacing:"0.5px"}}>+ add</button>
              </div>
              {addingToCat===cat&&(
                <div style={{display:"flex",gap:"7px",marginBottom:"8px"}}>
                  <input value={quickItem} onChange={e=>setQuickItem(e.target.value)} placeholder={`Add to ${cat}...`}
                    style={{...IS,flex:1}} onKeyDown={e=>e.key==="Enter"&&handleQuickAdd(cat)} autoFocus />
                  <button onClick={()=>handleQuickAdd(cat)} disabled={saving} style={{...BS,background:"#2d5a2d",color:"#fff"}}>Add</button>
                  <button onClick={()=>{setAddingToCat(null);setQuickItem("");}} style={{...BS,background:"#eee",color:"#555"}}>✕</button>
                </div>
              )}
              {catItems.map(g=>(
                <div key={g.id} style={{background:"#fff",border:"1px solid #e0d8c0",borderRadius:"4px",padding:"10px 12px",marginBottom:"4px",display:"flex",alignItems:"center",gap:"10px"}}>
                  <input type="checkbox" checked={false} onChange={()=>toggleGrocery(g.id,g.checked)} style={{width:"18px",height:"18px",cursor:"pointer",accentColor:"#2d5a2d",flexShrink:0}} />
                  <div style={{flex:1,fontSize:"14px",color:"#1a2a1a"}}>{g.item}</div>
                  <button onClick={()=>deleteGrocery(g.id)} style={{background:"none",border:"none",color:"#cc7a7a",cursor:"pointer",fontSize:"16px",padding:"0 2px"}}>×</button>
                </div>
              ))}
            </div>
          ))}
          {uncategorized.length>0&&(
            <div style={{marginBottom:"18px"}}>
              <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a7a5a",borderBottom:"1px solid #d0c8b0",paddingBottom:"4px",marginBottom:"8px"}}>Other</div>
              {uncategorized.map(g=>(
                <div key={g.id} style={{background:"#fff",border:"1px solid #e0d8c0",borderRadius:"4px",padding:"10px 12px",marginBottom:"4px",display:"flex",alignItems:"center",gap:"10px"}}>
                  <input type="checkbox" checked={false} onChange={()=>toggleGrocery(g.id,g.checked)} style={{width:"18px",height:"18px",cursor:"pointer",accentColor:"#2d5a2d"}} />
                  <div style={{flex:1,fontSize:"14px",color:"#1a2a1a"}}>{g.item}</div>
                  <button onClick={()=>deleteGrocery(g.id)} style={{background:"none",border:"none",color:"#cc7a7a",cursor:"pointer",fontSize:"16px"}}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{marginTop:"8px"}}>
            {!showAddGrocery?(
              <button onClick={()=>setShowAddGrocery(true)} style={{...BS,background:"none",border:"1px dashed #a0b898",color:"#5a7a5a",width:"100%",padding:"10px"}}>+ Add Item to New Category</button>
            ):(
              <div style={{background:"#fff",border:"1px solid #d0c8b0",borderRadius:"5px",padding:"12px"}}>
                <input value={newGrocery.item} onChange={e=>setNewGrocery({...newGrocery,item:e.target.value})} placeholder="Item..." style={{...IS,width:"100%",marginBottom:"6px"}} onKeyDown={e=>e.key==="Enter"&&handleAddGrocery()} autoFocus />
                <div style={{display:"flex",gap:"7px",marginBottom:"8px"}}>
                  <select value={newGrocery.category} onChange={e=>setNewGrocery({...newGrocery,category:e.target.value})} style={SS}>{GROCERY_CATS.map(c=><option key={c}>{c}</option>)}</select>
                  <input value={newGrocery.added_by} onChange={e=>setNewGrocery({...newGrocery,added_by:e.target.value})} placeholder="Added by..." style={{...IS,flex:1}} />
                </div>
                <div style={{display:"flex",gap:"7px"}}>
                  <button onClick={handleAddGrocery} disabled={saving} style={{...BS,background:"#2d5a2d",color:"#fff"}}>{saving?"Saving...":"Add"}</button>
                  <button onClick={()=>setShowAddGrocery(false)} style={{...BS,background:"#eee",color:"#555"}}>Cancel</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ── ATTRIBUTES (VI or RV) ─────────────────────────────────
  const isRevvy = isRV;
  const propLabel = isRevvy ? "Revelstoke" : "Vancouver Island";
  const propSub = isRevvy ? "Ski Condo · Revelstoke, BC" : "Waterfront Home · North Saanich, BC";
  const headerAccent = isRevvy ? "#5a7aac" : "#4a7c4a";
  const backScreen = "real_estate";
  const priceObj = isRevvy ? rvPrice : viPrice;
  const priceDraft = isRevvy ? rvPriceDraft : viPriceDraft;
  const setPriceDraft = isRevvy ? setRvPriceDraft : setViPriceDraft;
  const setPrice = isRevvy ? setRvPrice : setViPrice;

  return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:"#f8f6f0", minHeight:"100vh" }}>
      <style>{`@media print { .no-print{display:none!important} .item-row{break-inside:avoid} }`}</style>
      <div className="no-print" style={{ background:"#1a2a1a", color:"#d4c9a0", padding:"20px 24px 14px", borderBottom:`3px solid ${headerAccent}` }}>
        <button onClick={()=>setScreen(backScreen)} style={{ background:"none", border:"none", color:"#5a9c5a", fontSize:"12px", cursor:"pointer", padding:"0 0 6px 0", letterSpacing:"1px" }}>← REAL ESTATE</button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"8px" }}>
          <div>
            <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#5a7a5a" }}>{propSub}</div>
            <div style={{ fontSize:"22px", fontWeight:"bold" }}>{propLabel} Attributes</div>
            <div style={{ fontSize:"12px", color:"#5a7a5a", marginTop:"1px" }}>
              {loading?"Loading...":seeding?"Seeding data...":`${items.length} attributes`}
              {saving&&<span style={{color:"#ccaa6d",marginLeft:"8px"}}>Saving...</span>}
            </div>
          </div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            <button onClick={loadAttributes} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}}>↻</button>
            <button onClick={()=>window.print()} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}}>Print</button>
            {items.length===0&&!loading&&(
              <button onClick={seedData} disabled={seeding} style={{...BS,background:headerAccent,color:"#fff"}}>
                {seeding?"Loading...":"Load Attributes"}
              </button>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginTop:"12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", padding:"8px 12px", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#5a7a5a" }}>Budget Range</span>
          {priceObj.editing ? (
            <>
              <input value={priceDraft.min} onChange={e=>setPriceDraft(d=>({...d,min:e.target.value}))} placeholder="Min" style={{...IS,width:"120px",fontSize:"11px",background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}} />
              <span style={{color:"#5a7a5a"}}>—</span>
              <input value={priceDraft.max} onChange={e=>setPriceDraft(d=>({...d,max:e.target.value}))} placeholder="Max" style={{...IS,width:"120px",fontSize:"11px",background:"rgba(255,255,255,0.1)",color:"#d4c9a0",border:"1px solid rgba(255,255,255,0.2)"}} />
              <button onClick={()=>{ setPrice({min:priceDraft.min||priceObj.min,max:priceDraft.max||priceObj.max,editing:false}); }} style={{...BS,background:headerAccent,color:"#fff",padding:"4px 10px"}}>Save</button>
              <button onClick={()=>setPrice(p=>({...p,editing:false}))} style={{...BS,background:"rgba(255,255,255,0.1)",color:"#d4c9a0",padding:"4px 10px"}}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ fontSize:"13px", color:"#d4c9a0", fontWeight:"bold" }}>{priceObj.min} — {priceObj.max}</span>
              <button onClick={()=>{ setPriceDraft({min:priceObj.min,max:priceObj.max}); setPrice(p=>({...p,editing:true})); }} style={{...BS,background:"none",color:"#7a9c7a",padding:"2px 8px",fontSize:"10px",border:"1px solid rgba(255,255,255,0.15)"}}>Edit</button>
            </>
          )}
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
        {["All",...currentCategories].map(cat=>(
          <button key={cat} onClick={()=>setActiveCat(cat)} style={{
            background:"none",border:"none",
            borderBottom:activeCat===cat?`2px solid ${headerAccent}`:"2px solid transparent",
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
              <button onClick={()=>{setShowAdd(true);setNewItem({text:"",category:currentCategories[0],priority:"Must Have",source:"Existing",status:"Under Discussion",notes:""});}} style={{...BS,background:"#2d5a2d",color:"#d4c9a0"}}>+ Add Attribute</button>
            ):(
              <div style={{background:"#fff",border:"1px solid #c0b898",borderRadius:"5px",padding:"13px"}}>
                <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"7px"}}>
                  <select value={newItem.category} onChange={e=>setNewItem({...newItem,category:e.target.value})} style={SS}>{currentCategories.map(c=><option key={c}>{c}</option>)}</select>
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
              {seeding?"Loading — please wait...":"Load All Attributes"}
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
                        <select value={editItem.category} onChange={e=>setEditItem({...editItem,category:e.target.value})} style={SS}>{currentCategories.map(c=><option key={c}>{c}</option>)}</select>
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

function DashCard({ icon, title, subtitle, onClick, disabled, accent="#4a7c4a" }) {
  return (
    <div onClick={disabled?undefined:onClick} style={{
      background: disabled?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.06)",
      border: `1px solid ${disabled?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.12)"}`,
      borderLeft: disabled?"3px solid transparent":`3px solid ${accent}`,
      borderRadius:"8px", padding:"16px 20px", cursor:disabled?"default":"pointer",
      display:"flex", alignItems:"center", gap:"14px",
      opacity: disabled?0.4:1, transition:"all 0.2s",
    }}
    onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
    onMouseLeave={e=>{ if(!disabled) e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}>
      <div style={{fontSize:"22px"}}>{icon}</div>
      <div>
        <div style={{fontSize:"15px",fontWeight:"bold",color:"#d4c9a0"}}>{title}</div>
        <div style={{fontSize:"11px",color:"#5a7a5a",marginTop:"2px"}}>{subtitle}</div>
      </div>
      {!disabled&&<div style={{marginLeft:"auto",color:accent,fontSize:"18px"}}>›</div>}
    </div>
  );
}

function PropertyCard({ icon, title, subtitle, priceMin, priceMax, onClick, accent="#4a7c4a" }) {
  return (
    <div onClick={onClick} style={{
      background:"rgba(255,255,255,0.06)",
      border:"1px solid rgba(255,255,255,0.12)",
      borderLeft:`3px solid ${accent}`,
      borderRadius:"8px", padding:"16px 20px", cursor:"pointer",
      transition:"all 0.2s",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}>
      <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
        <div style={{fontSize:"22px"}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:"15px",fontWeight:"bold",color:"#d4c9a0"}}>{title}</div>
          <div style={{fontSize:"11px",color:"#5a7a5a",marginTop:"2px"}}>{subtitle}</div>
          <div style={{fontSize:"11px",color:accent,marginTop:"4px",letterSpacing:"0.3px"}}>{priceMin} — {priceMax}</div>
        </div>
        <div style={{color:accent,fontSize:"18px"}}>›</div>
      </div>
    </div>
  );
}
