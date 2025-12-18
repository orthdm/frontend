console.log('Skrypt (Zadanie 2) załadowany!');

// 1. Funkcja sprawdzająca czy liczba jest parzysta/nieparzysta
function isEven(num) {
  // Walidacja: sprawdzamy, czy podano liczbę
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return 'Nieprawidłowy argument (oczekiwano liczbę)';
  }
  // Jeśli reszta z dzielenia przez 2 wynosi 0 -> parzysta, w przeciwnym razie -> nieparzysta
  return (num % 2 === 0) ? 'parzysta' : 'nieparzysta';
}

// Przykłady użycia funkcji isEven
console.log('isEven(4) ->', isEven(4));   // parzysta
console.log('isEven(7) ->', isEven(7));   // nieparzysta
console.log('isEven(0) ->', isEven(0));   // parzysta

// 2. Kalkulator ocen (0-100 -> ocena słowna)
function getGrade(score) {
  // Walidacja wejścia: tylko liczby od 0 do 100
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
    return 'Nieprawidłowy wynik (oczekiwane 0-100)';
  }

  // Mapowanie zakresów punktów na oceny słowne
  if (score >= 90) {
    return 'Celujący';
  } else if (score >= 75) {
    return 'Bardzo dobry';
  } else if (score >= 60) {
    return 'Dobry';
  } else if (score >= 50) {
    return 'Dostateczny';
  } else if (score >= 40) {
    return 'Dopuszczający';
  } else {
    return 'Niedostateczny';
  }
}

console.log('getGrade(95) ->', getGrade(95)); // Celujący
console.log('getGrade(82) ->', getGrade(82)); // Bardzo dobry
console.log('getGrade(67) ->', getGrade(67)); // Dobry
console.log('getGrade(55) ->', getGrade(55)); // Dostateczny
console.log('getGrade(45) ->', getGrade(45)); // Dopuszczający
console.log('getGrade(30) ->', getGrade(30)); // Niedostateczny
console.log('getGrade(150) ->', getGrade(150)); // Nieprawidłowy wynik

// 3. Switch do wyświetlenia dnia tygodnia na podstawie numeru (1-7)
function dayOfWeek(num) {
  switch (num) {
    case 1:
      return 'Poniedziałek';
    case 2:
      return 'Wtorek';
    case 3:
      return 'Środa';
    case 4:
      return 'Czwartek';
    case 5:
      return 'Piątek';
    case 6:
      return 'Sobota';
    case 7:
      return 'Niedziela';
    default:
      return 'Nieprawidłowy numer dnia (oczekiwane 1-7)';
  }
}

// Przykłady switch
console.log('dayOfWeek(1) ->', dayOfWeek(1));
console.log('dayOfWeek(5) ->', dayOfWeek(5));
console.log('dayOfWeek(9) ->', dayOfWeek(9));

// 4. Operator trójargumentowy (ternary) do sprawdzenia pełnoletności
const age = 20; // przykład wieku (możesz zmienić)
const isAdult = (age >= 18) ? true : false; // ternary operator
console.log(`Wiek: ${age}, pełnoletni? ->`, isAdult);

console.log((age >= 18) ? 'Osoba jest pełnoletnia.' : 'Osoba jest niepełnoletnia.');

// 5. Użyj for do wyświetlenia liczb od 1 do 10
console.log('for: liczby od 1 do 10:');
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// 6. Użyj while do odliczania od 10 do 0
console.log('while: odliczanie od 10 do 0:');
let cnt = 10;
while (cnt >= 0) {
  console.log(cnt);
  cnt--;
}

// 7. Użyj for...of do iteracji po tablicy
const languages = ['JavaScript', 'Python', 'C#', 'Go'];
console.log('for...of: ulubione języki:');
for (const lang of languages) {
  console.log(lang);
}

// 8. Użyj for...in do iteracji po właściwościach obiektu
const car = { make: 'Toyota', model: 'Corolla', year: 2020 };
console.log('for...in: właściwości obiektu car:');
for (const key in car) {
  // for...in iteruje po kluczach (własnych enumerowalnych właściwościach)
  console.log(`${key}: ${car[key]}`);
}

// 9. Zastosuj break i continue w przykładowych pętlach
console.log('break i continue - przykładowa pętla:');
// Przykład: iterujemy 1..10; pomijamy liczby podzielne przez 3 (continue); przerywamy pętlę gdy >7 (break)
for (let n = 1; n <= 10; n++) {
  if (n % 3 === 0) {
    // continue - pomiń liczby podzielne przez 3
    console.log(`${n} - pominięte (podzielne przez 3)`);
    continue;
  }
  if (n > 7) {
    // break - przerwij pętlę gdy n > 7
    console.log(`${n} - warunek przerwania (n > 7). Kończę pętlę.`);
    break;
  }
  console.log(`${n} - przetworzono`);
}

console.log('Tabliczka mnożenia 1-10:');
for (let row = 1; row <= 10; row++) {
  let rowStr = '';
  for (let col = 1; col <= 10; col++) {
    const product = row * col;
    rowStr += `${row}×${col}=${product}`;
    if (col !== 10) rowStr += '  |  ';
  }
  console.log(rowStr);
}

// Alternatywna, grupowana prezentacja (opcjonalnie)
console.log('Tabliczka mnożenia (grupowanie):');
for (let r = 1; r <= 10; r++) {
  console.groupCollapsed(`Wiersz ${r}`);
  for (let c = 1; c <= 10; c++) {
    console.log(`${r} × ${c} = ${r * c}`);
  }
  console.groupEnd();
}

