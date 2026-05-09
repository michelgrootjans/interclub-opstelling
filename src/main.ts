import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { findDoubleCompositions, findSingleCompositions, type Composition, type Player as BasePlayer } from './logic/compositions'

type Player = BasePlayer & { available: boolean }

const PLAYERS_KEY = 'tennis-players'
const LIMIT_KEY = 'tennis-limit'
const DEFAULT_LIMIT = 140

function loadPlayers(): Player[] {
  const stored = localStorage.getItem(PLAYERS_KEY)
  if (!stored) return []
  return (JSON.parse(stored) as Player[]).map(p => ({ ...p, available: p.available ?? true }))
}

function savePlayers(players: Player[]): void {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

function loadLimit(): number {
  const stored = localStorage.getItem(LIMIT_KEY)
  return stored ? parseInt(stored) : DEFAULT_LIMIT
}

function saveLimit(limit: number): void {
  localStorage.setItem(LIMIT_KEY, String(limit))
}

async function loadPreset(name: string): Promise<Player[] | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}presets/${name}.json`)
    if (!res.ok) return null
    const data = await res.json() as (BasePlayer & { available?: boolean })[]
    return data.map(p => ({ ...p, available: p.available ?? false }))
  } catch {
    return null
  }
}

let players: Player[] = loadPlayers()
let limit: number = loadLimit()

const params = new URLSearchParams(location.search)
const preset = params.get('preset')
if (preset) {
  const presetPlayers = await loadPreset(preset)
  if (presetPlayers) {
    players = presetPlayers
    savePlayers(players)
  }
  params.delete('preset')
  const newUrl = location.pathname + (params.size ? '?' + params.toString() : '')
  location.replace(newUrl)
}

const app = document.getElementById('app')!

app.innerHTML = `
  <h1>Interclub Planning</h1>

  <div class="main-tabs">
    <button class="main-tab active" data-panel="player-list">Spelers</button>
    <button class="main-tab" data-panel="compositions">Opstellingen</button>
  </div>

  <section id="player-list" class="panel">
    <ul id="players-ul"></ul>
    <button id="btn-add-player" class="btn-add"><i class="fa-solid fa-plus"></i></button>
    <form id="player-form">
      <input id="input-name"    type="text"   placeholder="Naam"            required />
      <input id="input-singles" type="number" placeholder="Enkel klassemtn" required min="1" />
      <input id="input-doubles" type="number" placeholder="Dubbel klassement" required min="1" />
      <button type="submit">Toevoegen</button>
      <button type="button" id="btn-cancel-add">Annuleer</button>
    </form>
  </section>

  <section id="compositions" class="panel hidden">
    <label>Serie<input id="input-limit" type="number" min="1" /></label>
    <div class="tabs">
      <button class="tab active" data-tab="singles">Enkels</button>
      <button class="tab" data-tab="doubles">Dubbels</button>
    </div>
    <div id="singles-compositions-list" class="tab-panel"></div>
    <div id="doubles-compositions-list" class="tab-panel hidden"></div>
  </section>
`

const form = document.getElementById('player-form') as HTMLFormElement
const nameInput = document.getElementById('input-name') as HTMLInputElement
const singlesInput = document.getElementById('input-singles') as HTMLInputElement
const doublesInput = document.getElementById('input-doubles') as HTMLInputElement
const limitInput = document.getElementById('input-limit') as HTMLInputElement
const playersUl = document.getElementById('players-ul')!
const btnAddPlayer = document.getElementById('btn-add-player')!
const singlesCompositionsList = document.getElementById('singles-compositions-list')!
const doublesCompositionsList = document.getElementById('doubles-compositions-list')!

function showAddForm(): void {
  form.style.display = 'flex'
  btnAddPlayer.style.display = 'none'
  nameInput.focus()
}

function hideAddForm(): void {
  form.style.display = 'none'
  btnAddPlayer.style.display = ''
  form.reset()
}

hideAddForm()

btnAddPlayer.addEventListener('click', showAddForm)
document.getElementById('btn-cancel-add')!.addEventListener('click', hideAddForm)

limitInput.value = String(limit)

let editingIndex: number | null = null

function renderPlayers(): void {
  playersUl.innerHTML = players
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.singles - a.p.singles)
    .map(({ p, i }) => i === editingIndex ? `
      <li class="editing">
        <input class="edit-name"    value="${p.name}"    type="text"   />
        <input class="edit-singles" value="${p.singles}" type="number" min="1" />
        <input class="edit-doubles" value="${p.doubles}" type="number" min="1" />
        <span class="player-actions">
          <button data-save="${i}">Opslaan</button>
          <button data-cancel>Annuleer</button>
        </span>
      </li>
    ` : `
      <li class="${p.available ? '' : 'unavailable'}">
        <button class="btn-icon btn-toggle ${p.available ? 'on' : 'off'}" data-toggle="${i}"><i class="fa-solid fa-toggle-${p.available ? 'on' : 'off'}"></i></button>
        <span>${p.name} ${p.singles}/${p.doubles}</span>
        <span class="player-actions">
          <button class="btn-icon" data-edit="${i}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-delete" data-index="${i}"><i class="fa-solid fa-trash-can"></i></button>
        </span>
      </li>
    `)
    .join('')
}

type Slot = { ranking: number; names: string[] }
type MergedComposition = { total: number; slots: Slot[] }

function groupCompositions(
  compositions: Composition[],
  ranking: (p: BasePlayer) => number
): MergedComposition[] {
  const groups = new Map<string, MergedComposition>()
  for (const comp of compositions) {
    const sorted = [...comp.players].sort((a, b) => ranking(b) - ranking(a))
    const key = `${comp.total}_${sorted.map(p => ranking(p)).join('_')}`
    if (!groups.has(key)) {
      groups.set(key, { total: comp.total, slots: sorted.map(p => ({ ranking: ranking(p), names: [p.name] })) })
    } else {
      sorted.forEach((p, i) => {
        const slot = groups.get(key)!.slots[i]
        if (!slot.names.includes(p.name)) slot.names.push(p.name)
      })
    }
  }
  return [...groups.values()]
}

function renderCompositions(
  container: HTMLElement,
  compositions: Composition[],
  ranking: (p: BasePlayer) => number
): void {
  if (compositions.length === 0) {
    container.innerHTML = '<p>Geen geldige opstellingen.</p>'
    return
  }
  container.innerHTML = groupCompositions(compositions, ranking)
    .map(c => `
      <div class="composition">
        <strong>Totaal: ${c.total}</strong>
        <ul>${c.slots.map(s => `<li>${s.names.length === 1 ? s.names[0] : `${s.names.slice(0, -1).join(', ')} of ${s.names.at(-1)}`} (${s.ranking})</li>`).join('')}</ul>
      </div>
    `)
    .join('')
}

function renderSinglesCompositions(): void {
  const available = players.filter(p => p.available)
  const compositions = findSingleCompositions(available, limit).sort((a, b) => b.total - a.total)
  renderCompositions(singlesCompositionsList, compositions, p => p.singles)
}

function renderDoubleCompositions(): void {
  const available = players.filter(p => p.available)
  const compositions = findDoubleCompositions(available, limit).sort((a, b) => b.total - a.total)
  renderCompositions(doublesCompositionsList, compositions, p => p.doubles)
}

function update(): void {
  renderPlayers()
  renderSinglesCompositions()
  renderDoubleCompositions()
}

form.addEventListener('submit', e => {
  e.preventDefault()
  players = [...players, {
    name: nameInput.value.trim(),
    singles: parseInt(singlesInput.value),
    doubles: parseInt(doublesInput.value),
    available: true,
  }]
  savePlayers(players)
  hideAddForm()
  update()
})

playersUl.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-edit],[data-cancel],[data-save],[data-index],[data-toggle]')
  if (!btn) return
  if (btn.dataset.edit !== undefined) {
    editingIndex = parseInt(btn.dataset.edit)
    renderPlayers()
  } else if (btn.dataset.cancel !== undefined) {
    editingIndex = null
    renderPlayers()
  } else if (btn.dataset.save !== undefined) {
    const index = parseInt(btn.dataset.save)
    const li = btn.closest('li')!
    const name    = (li.querySelector('.edit-name')    as HTMLInputElement).value.trim()
    const singles = parseInt((li.querySelector('.edit-singles') as HTMLInputElement).value)
    const doubles = parseInt((li.querySelector('.edit-doubles') as HTMLInputElement).value)
    players = players.map((p, i) => i === index ? { ...p, name, singles, doubles } : p)
    savePlayers(players)
    editingIndex = null
    update()
  } else if (btn.dataset.index !== undefined) {
    const index = parseInt(btn.dataset.index)
    players = players.filter((_, i) => i !== index)
    savePlayers(players)
    update()
  } else if (btn.dataset.toggle !== undefined) {
    const index = parseInt(btn.dataset.toggle)
    players = players.map((p, i) => i === index ? { ...p, available: !p.available } : p)
    savePlayers(players)
    update()
  }
})

document.querySelector('.tabs')!.addEventListener('click', e => {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('.tab')
  if (!tab) return
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'))
  tab.classList.add('active')
  document.getElementById(`${tab.dataset.tab}-compositions-list`)!.classList.remove('hidden')
})

document.querySelector('.main-tabs')!.addEventListener('click', e => {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('.main-tab')
  if (!tab) return
  document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'))
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'))
  tab.classList.add('active')
  document.getElementById(tab.dataset.panel!)!.classList.remove('hidden')
})

limitInput.addEventListener('input', () => {
  const val = parseInt(limitInput.value)
  if (!isNaN(val) && val > 0) {
    limit = val
    saveLimit(limit)
    update()
  }
})

update()
