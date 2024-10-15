// import { useEffect } from 'react';
// import { useLocalStorage } from 'usehooks-ts';

// export function useLocalStorageListener<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
//   const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);

//   useEffect(() => {
//     function handleStorageChange(e: StorageEvent) {
//       if (e.key === key) {
//         try {
//           const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
//           setStoredValue(newValue);
//         } catch (error) {
//           console.error('Error parsing storage value:', error);
//         }
//       }
//     }

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [key, initialValue, setStoredValue]);

//   return [storedValue, setStoredValue];
// }
