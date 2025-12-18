// Część A - Konfiguracja
console.log('Skrypt załadowany!'); // Sprawdzenie, czy skrypt się załadował

// Część B - Zmienne i typy danych

// 4. String - moje imię
const myName = 'Patryk'; // przykład imienia (zmień jeśli chcesz)
console.log('myName:', myName);
console.log('typeof myName:', typeof myName); // powinno być "string"

// 5. Number - mój wiek
const myAge = 27; // wpisz swój wiek
console.log('myAge:', myAge);
console.log('typeof myAge:', typeof myAge); // "number"

// 6. Boolean - Czy jestem studentem
const isStudent = true; // true lub false
console.log('isStudent:', isStudent);
console.log('typeof isStudent:', typeof isStudent); // "boolean"

// 7. Array - Lista 3 ulubionych języków programowania
const favLanguages = ['JavaScript', 'Java', 'C'];
console.log('favLanguages:', favLanguages);
console.log('typeof favLanguages:', typeof favLanguages); // "object" (tablice są typem object)
console.log('Array.isArray(favLanguages):', Array.isArray(favLanguages)); // true - potwierdza, że to tablica

// 8. Object - Obiekt z moimi danymi (imię, wiek, miasto)
const person = {
  name: myName,
  age: myAge,
  city: 'Krosno'
};
console.log('person:', person);
console.log('typeof person:', typeof person); // "object"

// 9. null i undefined - Zadeklaruj zmienne z tymi wartościami
const nullVar = null;
let undefinedVar; // zadeklarowana, ale nie zainicjalizowana -> undefined
console.log('nullVar:', nullVar);
console.log('typeof nullVar:', typeof nullVar); // uwaga: w JS typeof null -> "object" (historyczny quirk)
console.log('undefinedVar:', undefinedVar);
console.log('typeof undefinedVar:', typeof undefinedVar); // "undefined"

// Część C - Operatory

// 11. Operacje arytmetyczne: +, -, *, /, %, **
const a = 10;
const b = 3;

console.log('a + b =', a + b);   // dodawanie
console.log('a - b =', a - b);   // odejmowanie
console.log('a * b =', a * b);   // mnożenie
console.log('a / b =', a / b);   // dzielenie
console.log('a % b =', a % b);   // modulo - reszta z dzielenia
console.log('a ** b =', a ** b); // potęgowanie (10 do potęgi 3)

// 12. Porównanie == vs === na przykładzie '5' i 5
const strFive = '5';
const numFive = 5;

console.log("'5' == 5 ->", strFive == numFive);   // true — == porównuje po konwersji typów
console.log("'5' === 5 ->", strFive === numFive); // false — === sprawdza zarówno wartość, jak i typ

// Komentarz: preferuj === w większości sytuacji, bo wymusza porównanie bez konwersji typów.

// 13. Operatory logiczne: &&, ||, !
const condA = true;
const condB = false;

console.log('condA && condB ->', condA && condB); // AND: true tylko gdy oba true
console.log('condA || condB ->', condA || condB); // OR: true gdy przynajmniej jedno true
console.log('!condA ->', !condA);                 // NOT: negacja (true -> false)

// Przykład logiczny z porównaniami:
console.log('(a > b) && (myAge >= 18) ->', (a > b) && (myAge >= 18));
// (a > b) sprawdza, czy a jest większe od b; myAge >= 18 sprawdza pełnoletność.
// Całe wyrażenie jest true tylko jeśli obie części są true.
