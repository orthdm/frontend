const API_BASE = 'https://jsonplaceholder.typicode.com';
const statusArea = document.getElementById('statusArea');
const statusText = document.getElementById('statusText');
const errorArea = document.getElementById('errorArea');
const tableContainer = document.getElementById('tableContainer');
const postsContainer = document.getElementById('postsContainer');
const demoLog = document.getElementById('demoLog');

function log(msg){
  const time = new Date().toLocaleTimeString();
  demoLog.textContent += `[${time}] ${msg}\n`;
  console.log(msg);
}

function showLoader(show, text='Ładowanie...'){
  statusArea.style.visibility = show ? 'visible' : 'hidden';
  statusText.textContent = text;
}

function showError(message){
  errorArea.style.display = 'block';
  errorArea.className = 'error';
  errorArea.textContent = message;
}

function clearError(){
  errorArea.style.display = 'none';
  errorArea.textContent = '';
}

function simulateLoad(name, ms = 1000, shouldFail = false){
  return new Promise((resolve, reject) => {
    log(`simulateLoad(${name}) — started (${ms}ms)`);
    setTimeout(() => {
      if (shouldFail) {
        log(`simulateLoad(${name}) — rejected`);
        reject(new Error(`Błąd ładowania ${name}`));
      } else {
        log(`simulateLoad(${name}) — resolved`);
        resolve({name, ms, ts: Date.now()});
      }
    }, ms);
  });
}

function demoPromises_then_catch_finally(){
  demoLog.textContent = '';
  log('DEMO: .then()/.catch()/.finally()');
  simulateLoad('A', 800)
    .then(result => log('then: otrzymano ' + JSON.stringify(result)))
    .catch(err => log('catch: ' + err.message))
    .finally(() => log('finally: demoPromises_then_catch_finally zakończone'));

  // Promise.all
  Promise.all([simulateLoad('p1',300), simulateLoad('p2',500), simulateLoad('p3',200)])
    .then(results => log('Promise.all: wszystkie zakończone: ' + results.map(r=>r.name).join(',')))
    .catch(err => log('Promise.all catch: ' + err.message));

  // Promise.race jako timeout
  const slowFetch = simulateLoad('slow', 900);
  const timeout = new Promise((_, reject) => setTimeout(()=>reject(new Error('Timeout 400ms')), 400));
  Promise.race([slowFetch, timeout])
    .then(v => log('Promise.race: wygrał: ' + JSON.stringify(v)))
    .catch(err => log('Promise.race: błąd (timeout?): ' + err.message));
}

async function demoAsyncAwait(){
  demoLog.textContent = '';
  log('DEMO async/await: start');
  try{
    const a = await simulateLoad('AA', 300);
    log('await: otrzymano ' + a.name);

    // sekwencyjnie
    const b = await simulateLoad('BB', 400);
    log('sekwencyjnie: BB po AA');

    // równolegle
    const parallel = [simulateLoad('P1', 500), simulateLoad('P2', 200), simulateLoad('P3', 350)];
    const results = await Promise.all(parallel);
    log('await Promise.all: ' + results.map(r=>r.name).join(','));

  } catch(err){
    log('async/await catch: ' + err.message);
  } finally{
    log('DEMO async/await: koniec');
  }
}


function fetchWithTimeout(url, timeoutMs = 5000){
  const fetchPromise = fetch(url).then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Fetch timeout ('+timeoutMs+'ms)')), timeoutMs)
  );
  return Promise.race([fetchPromise, timeoutPromise]);
}

async function loadUsers(){
  clearError();
  showLoader(true, 'Pobieram listę użytkowników...');
  log('loadUsers: fetch start');
  try{
    const users = await fetchWithTimeout(API_BASE + '/users', 6000);
    log('loadUsers: otrzymano ' + users.length + ' użytkowników');
    renderUsersTable(users);
  } catch(err){
    log('loadUsers error: ' + err.message);
    showError('Błąd pobierania użytkowników: ' + err.message);
    tableContainer.innerHTML = '';
  } finally{
    showLoader(false);
  }
}

function renderUsersTable(users){
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Imię</th><th>Użytkownik</th><th>Email</th><th>Miasto</th><th>Firma</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = 'user-row';
    tr.dataset.userid = u.id;
    tr.innerHTML = `
      <td>${escapeHtml(u.name)}</td>
      <td class="small">@${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td class="small">${escapeHtml(u.address.city)}</td>
      <td class="small">${escapeHtml(u.company.name)}</td>
    `;
    tr.addEventListener('click', () => onUserClick(u));
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}

async function onUserClick(user){
  clearError();
  postsContainer.innerHTML = '';
  showLoader(true, `Pobieram posty użytkownika ${user.username}...`);
  try{
    const posts = await fetchWithTimeout(API_BASE + `/users/${user.id}/posts`, 6000);
    log(`onUserClick: pobrano ${posts.length} postów dla user ${user.id}`);
    renderPosts(user, posts);
  } catch(err){
    log('onUserClick error: ' + err.message);
    showError('Błąd pobierania postów: ' + err.message);
  } finally{
    showLoader(false);
  }
}

function renderPosts(user, posts){
  const container = document.createElement('div');
  container.innerHTML = `<h3>Posty użytkownika ${escapeHtml(user.name)} (<em class=\"small\">@${escapeHtml(user.username)}</em>)</h3>`;
  posts.forEach(p => {
    const d = document.createElement('div');
    d.className = 'post';
    d.innerHTML = `<strong>${escapeHtml(p.title)}</strong><div class=\"small\">${escapeHtml(p.body)}</div>`;
    container.appendChild(d);
  });
  postsContainer.innerHTML = '';
  postsContainer.appendChild(container);
}

function escapeHtml(s){
  return String(s).replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch]));
}

//event handlery
document.getElementById('refreshBtn').addEventListener('click', () => loadUsers());
document.getElementById('demoPromisesBtn').addEventListener('click', () => {
  demoPromises_then_catch_finally();
  setTimeout(()=>demoAsyncAwait(), 1300);
});

// ładuje się automatycznie przy uruchomieniu
loadUsers();

async function fetchUsersAwait(){
  try{
    showLoader(true,'fetchUsersAwait: fetch...');
    const users = await fetchWithTimeout(API_BASE + '/users', 6000);
    log('fetchUsersAwait: OK ' + users.length);
  } catch(err){
    log('fetchUsersAwait catch: ' + err.message);
  } finally{
    showLoader(false);
  }
}

async function runSequentialOperations(){
  try{
    showLoader(true,'Wykonuję operacje sekwencyjnie...');
    const r1 = await simulateLoad('seq1', 300);
    const r2 = await simulateLoad('seq2', 400);
    const r3 = await simulateLoad('seq3', 200);
    log('runSequentialOperations: done ' + [r1.name,r2.name,r3.name].join(','));
  } catch(err){
    log('runSequentialOperations error: ' + err.message);
  } finally{
    showLoader(false);
  }
}

async function runParallelOperations(){
  try{
    showLoader(true,'Wykonuję operacje równolegle...');
    const arr = [simulateLoad('par1',400), simulateLoad('par2',300), simulateLoad('par3',500)];
    const res = await Promise.all(arr);
    log('runParallelOperations: done ' + res.map(r=>r.name).join(','));
  } catch(err){
    log('runParallelOperations error: ' + err.message);
  } finally{
    showLoader(false);
  }
}

window._zadanie6 = {
  simulateLoad, demoPromises_then_catch_finally, demoAsyncAwait,
  runSequentialOperations, runParallelOperations, fetchUsersAwait, fetchWithTimeout, loadUsers
};
