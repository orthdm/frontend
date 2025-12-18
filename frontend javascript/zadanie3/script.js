console.log('Skrypt (Zadanie 3) załadowany!');

function multiplyDecl(a, b) {
  // prosta funkcja mnożąca, deklarowana jako function declaration
  return a * b;
}
console.log('multiplyDecl(3,4) =', multiplyDecl(3,4));

// 2) Function Expression
const multiplyExpr = function(a, b) {
  // przypisanie funkcji anonimowej do stałej
  return a * b;
};
console.log('multiplyExpr(5,6) =', multiplyExpr(5,6));

// 3) Arrow Function
const multiplyArrow = (a, b) => a * b;
console.log('multiplyArrow(7,8) =', multiplyArrow(7,8));

// 4) IIFE (Immediately Invoked Function Expression)
// Tutaj pokazujemy wykonanie fragmentu kodu od razu
(function(a, b) {
  const result = a + b;
  console.log('IIFE suma (2+3) =', result);
})(2, 3);

// 5) Funkcja z parametrami domyślnymi
function greet(name = 'Anonim', greeting = 'Cześć') {
  return `${greeting}, ${name}!`;
}
console.log(greet()); // wykorzystuje domyślne parametry
console.log(greet('Ala', 'Witaj')); // nadpisanie domyślnych

// 6) Użycie parametru rest (...args)
function sumAll(...nums) {
  // zwraca sumę dowolnej liczby argumentów
  return nums.reduce((acc, v) => acc + v, 0);
}
console.log('sumAll(1,2,3,4) =', sumAll(1,2,3,4));
console.log('sumAll() =', sumAll()); // 0

// 7) Zwrócenie obiektu z wieloma wartościami
function createPerson(name, age, city) {
  // zwracamy obiekt z wieloma polami
  return {
    name,
    age,
    city,
    description() {
      return `${name}, ${age} lat, ${city}`;
    }
  };
}
const p = createPerson('Patryk', 27, 'Krosno');
console.log('createPerson ->', p);
console.log('p.description() ->', p.description());

// 8) Funkcja przyjmująca callback
function withCallback(value, callback) {
  // wykonaj callback na wartości i zwróć wynik
  if (typeof callback === 'function') {
    return callback(value);
  }
  return null;
}
// przykład użycia: podajemy funkcję, która mnoży przez 10
console.log('withCallback(7, x => x*10) ->', withCallback(7, x => x * 10));

// 9) Funkcja zwracająca inną funkcję (higher-order function)
function makeAdder(x) {
  // zwraca funkcję, która dodaje x do swojego argumentu
  return function(y) {
    return x + y;
  };
}
const add5 = makeAdder(5);
console.log('add5(10) =', add5(10)); // 15

// 10) Różnice między var, let i const w funkcjach

function varLetConstDemo() {
  // var - function-scoped (dostępne poza blokiem)
  if (true) {
    var v = 'var-value';
    let l = 'let-value';
    const c = 'const-value';
    console.log('wewnątrz bloku: v, l, c ->', v, l, c);
  }
  // v jest dostępne poza blokiem (bo var jest function-scoped)
  console.log('poza blokiem: v ->', v);

  // l i c są block-scoped - bezpośrednie odwołanie spowodowałoby ReferenceError.
  // Aby nie wywoływać błędu, sprawdzamy w try/catch:
  try {
    console.log('poza blokiem: l ->', l);
  } catch (e) {
    console.log('poza blokiem: l -> błąd: zmienna "l" jest block-scoped (nie istnieje poza blokiem)');
  }

  try {
    console.log('poza blokiem: c ->', c);
  } catch (e) {
    console.log('poza blokiem: c -> błąd: zmienna "c" jest block-scoped (nie istnieje poza blokiem)');
  }

  // Var można (teoretycznie) redeklarować w tej samej funkcji:
  var v = 'var-redeclared';
  console.log('v po redeklaracji var ->', v);

  // let nie pozwala na redeklarację w tym samym scope (wyrzuci błąd, więc pokazujemy komentarzem)
  // const nie pozwala na przypisanie ponowne (spróbujemy w try/catch aby pokazać efekt):
  const obj = { x: 1 };
  console.log('const binding (obj) przed modyfikacją ->', obj);
  // modyfikacja zawartości obiektu pod const jest możliwa:
  obj.x = 2;
  console.log('const binding (obj) po modyfikacji właściwości ->', obj);

  try {
    // próba przypisania nowej wartości do const (spowoduje TypeError)
    // obj = { x: 3 }; // nie odpalamy bezpośrednio - zamiast tego pokazujemy w try/catch:
    throw new TypeError('Próba zmiany referencji const spowodowałaby TypeError (nie można przypisać ponownie).');
  } catch (e) {
    console.log('próba nadpisania const ->', e.message);
  }
}
varLetConstDemo();

// 11) Przykład pokazujący zasięg blokowy
if (true) {
  let blockVar = 'jestem w bloku';
  console.log('wewnątrz bloku blockVar ->', blockVar);
}
try {
  console.log('poza blokiem blockVar ->', blockVar);
} catch (e) {
  console.log('poza blokiem blockVar -> błąd: blockVar is not defined (zmienna block-scoped)');
}

// 12) Closure: licznik z zapamiętanym stanem
function createCounter(initial = 0) {
  // zmienna 'count' jest w "otoczeniu leksykalnym" funkcji createCounter
  // i jest dostępna dla wewnętrznych funkcji, które zostaną zwrócone.
  let count = initial;

  // zwracamy obiekt z metodami, które zamykają (capture) zmienną 'count'
  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counter = createCounter(5);
console.log('counter.getValue() ->', counter.getValue()); // 5
console.log('counter.increment() ->', counter.increment()); // 6
console.log('counter.increment() ->', counter.increment()); // 7
console.log('counter.decrement() ->', counter.decrement()); // 6

// 13) Jak działa domknięcie (closure):
/*
  - Kiedy wywołujemy createCounter(5), wewnątrz funkcji tworzona jest zmienna `count`.
  - Funkcja createCounter zwraca obiekt zawierający funkcje (increment, decrement, getValue).
  - Te zwrócone funkcje dalej "pamiętają" referencję do środowiska leksykalnego, w którym zostały utworzone,
    czyli mają dostęp do zmiennej `count` nawet po tym, jak createCounter zakończyła działanie.
  - To właśnie jest domknięcie (closure): funkcja razem z powiązanym środowiskiem zmiennych.
  - Dzięki temu `count` jest prywatny (niedostępny bezpośrednio z zewnątrz), ale może być modyfikowany
    przez zwrócone metody. Pozwala to na enkapsulację stanu.
*/

console.log('Przykład zamknięć w pętli:');

// Problem (gdy użyto by var): wszystkie funkcje wskazywałyby na ostatnią wartość i zwracałyby to samo.
// Poprawne podejście z użyciem let (blokowy zakres) lub IIFE.

// użycie let - każda iteracja ma własne bound value
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(() => i);
}
console.log('funcs[0]() ->', funcs[0]()); // 0
console.log('funcs[1]() ->', funcs[1]()); // 1
console.log('funcs[2]() ->', funcs[2]()); // 2

// porównanie z var (pokazane bez błędu): tutaj po pętli var i===3 więc każdy zwróci 3
const funcsVar = [];
for (var j = 0; j < 3; j++) {
  funcsVar.push(() => j);
}
console.log('funcsVar[0]() ->', funcsVar[0]()); // 3
console.log('funcsVar[1]() ->', funcsVar[1]()); // 3
console.log('funcsVar[2]() ->', funcsVar[2]()); // 3
