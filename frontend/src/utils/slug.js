// src/utils/slug.js

/**
 * Génère un slug URL-friendly à partir d'une chaîne de texte (supprime accents, espaces, etc.)
 * @param {string} text - Le texte à convertir.
 * @returns {string} Le slug généré.
 */
export function createSlug(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize('NFD') // Normalise les caractères (é -> e)
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques (accents)
        .trim() // Enlève les espaces au début et à la fin
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/[^\w\-]+/g, '') // Supprime tous les caractères non alphanumériques (sauf les tirets)
        .replace(/\-\-+/g, '-'); // Remplace les tirets multiples par un seul
}