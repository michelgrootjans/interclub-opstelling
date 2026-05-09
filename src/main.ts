import './style.css'
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

let players: Player[] = loadPlayers()
let limit: number = loadLimit()

const app = document.getElementById('app')!

app.innerHTML = `
  <h1>Interclub Planning</h1>

  <section id="player-list">
    <details open>
      <summary>Spelers</summary>
      <ul id="players-ul"></ul>
    </details>
    <details>
      <summary>Speler toevoegen</summary>
      <form id="player-form">
        <input id="input-name"    type="text"   placeholder="Naam"            required />
        <input id="input-singles" type="number" placeholder="Singles ranking" required min="1" />
        <input id="input-doubles" type="number" placeholder="Doubles ranking" required min="1" />
        <button type="submit">Toevoegen</button>
      </form>
    </details>
  </section>

  <section id="compositions">
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
const singlesCompositionsList = document.getElementById('singles-compositions-list')!
const doublesCompositionsList = document.getElementById('doubles-compositions-list')!

limitInput.value = String(limit)

function renderPlayers(): void {
  playersUl.innerHTML = players
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.singles - a.p.singles)
    .map(({ p, i }) => `
      <li class="${p.available ? '' : 'unavailable'}">
        <span>${p.name} ${p.singles}/${p.doubles}</span>
        <span class="player-actions">
          <button data-toggle="${i}">${p.available ? 'Afwezig' : 'Beschikbaar'}</button>
          <button data-index="${i}">Verwijder</button>
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
        <ul>${c.slots.map(s => `<li>${s.names.join(' of ')} (${s.ranking})</li>`).join('')}</ul>
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
  form.reset()
  update()
})

playersUl.addEventListener('click', e => {
  const btn = e.target as HTMLElement
  if (btn.dataset.index !== undefined) {
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

limitInput.addEventListener('input', () => {
  const val = parseInt(limitInput.value)
  if (!isNaN(val) && val > 0) {
    limit = val
    saveLimit(limit)
    update()
  }
})

update()
