// В базе тег хранится без собачки и в нижнем регистре: «@» — это оформление,
// его добавляет интерфейс при показе
export const normalizeUserTag = (raw: string) =>
  raw.trim().replace(/^@+/, "").toLowerCase();

// Тег попадает в адрес /posts/:tag, поэтому только латиница, цифры и «_»
export const isValidUserTag = (tag: string) => /^[a-z0-9_]{3,30}$/.test(tag);
