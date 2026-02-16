import { VocabItem } from '../data/vocab';

export interface SectionData {
    title: string;
    data: VocabItem[];
}

const GOJUON_ROWS = [
    { label: 'あ', chars: ['あ'] },
    { label: 'い', chars: ['い'] },
    { label: 'う', chars: ['う'] },
    { label: 'え', chars: ['え'] },
    { label: 'お', chars: ['お'] },
    { label: 'か', chars: ['か', 'が'] },
    { label: 'き', chars: ['き', 'ぎ'] },
    { label: 'く', chars: ['く', 'ぐ'] },
    { label: 'け', chars: ['け', 'げ'] },
    { label: 'こ', chars: ['こ', 'ご'] },
    { label: 'さ', chars: ['さ', 'ざ'] },
    { label: 'し', chars: ['し', 'じ'] },
    { label: 'す', chars: ['す', 'ず'] },
    { label: 'せ', chars: ['せ', 'ぜ'] },
    { label: 'そ', chars: ['そ', 'ぞ'] },
    { label: 'た', chars: ['た', 'だ'] },
    { label: 'ち', chars: ['ち', 'ぢ'] },
    { label: 'つ', chars: ['つ', 'づ'] },
    { label: 'て', chars: ['て', 'で'] },
    { label: 'と', chars: ['と', 'ど'] },
    { label: 'な', chars: ['な'] },
    { label: 'に', chars: ['に'] },
    { label: 'ぬ', chars: ['ぬ'] },
    { label: 'ね', chars: ['ね'] },
    { label: 'の', chars: ['の'] },
    { label: 'は', chars: ['は', 'ば', 'ぱ'] },
    { label: 'ひ', chars: ['ひ', 'び', 'ぴ'] },
    { label: 'ふ', chars: ['ふ', 'ぶ', 'ぷ'] },
    { label: 'へ', chars: ['へ', 'べ', 'ぺ'] },
    { label: 'ほ', chars: ['ほ', 'ぼ', 'ぽ'] },
    { label: 'ま', chars: ['ま'] },
    { label: 'み', chars: ['み'] },
    { label: 'む', chars: ['む'] },
    { label: 'め', chars: ['め'] },
    { label: 'も', chars: ['も'] },
    { label: 'や', chars: ['や'] },
    { label: 'ゆ', chars: ['ゆ'] },
    { label: 'よ', chars: ['よ'] },
    { label: 'ら', chars: ['ら'] },
    { label: 'り', chars: ['り'] },
    { label: 'る', chars: ['る'] },
    { label: 'れ', chars: ['れ'] },
    { label: 'ろ', chars: ['ろ'] },
    { label: 'わ', chars: ['わ'] },
    { label: 'を', chars: ['を'] },
    { label: 'ん', chars: ['ん'] },
];

export const groupVocabByGojuon = (vocabList: VocabItem[]): SectionData[] => {
    const sections: SectionData[] = GOJUON_ROWS.map(row => ({
        title: row.label,
        data: []
    }));

    // Special section for months
    const monthsSection: SectionData = { title: '〜がつ', data: [] };

    // Special section for か-related items
    const kaSpecial: SectionData = { title: '〜か', data: [] };

    // Special section for こ-related items
    const koSpecial: SectionData = { title: '〜こ', data: [] };

    // Special section for さ-related items
    const saSpecial: SectionData = { title: '〜さ', data: [] };

    // Special section for し-related items
    const shiSpecial: SectionData = { title: '〜し', data: [] };

    // Special section for す-related items
    const suSpecial: SectionData = { title: '〜す', data: [] };

    // Also include an 'Others' section for anything that doesn't match
    const others: SectionData = { title: 'Others', data: [] };


    vocabList.forEach(item => {
        // Special handling for specific words that should be in あ section
        if (item.kanji === '赤い' || item.kanji === '温かい' || item.kanji === '暖かい') {
            const aRowIndex = GOJUON_ROWS.findIndex(row => row.label === 'あ');
            if (aRowIndex !== -1) {
                sections[aRowIndex].data.push(item);
                return;
            }
        }

        // Special handling for months - assign to 〜がつ section
        if (item.furigana.endsWith('がつ')) {
            monthsSection.data.push(item);
            return;
        }

        // Special handling for か-related items - assign to 〜か section
        if (item.furigana.endsWith('かい') ||
            item.furigana.endsWith('かげつ') ||
            item.furigana.endsWith('がります') ||
            item.furigana.endsWith('がわ')) {
            kaSpecial.data.push(item);
            return;
        }

        // Special handling for こ-related items - assign to 〜こ section
        if (item.furigana.endsWith('こ') ||
            item.furigana.endsWith('ご')) {
            // Only if it's a suffix/counter (starts with 〜 or is specific)
            if (item.kanji.startsWith('〜') || item.kanji === '五' || item.kanji === 'ごろ' || item.kanji === '午後' || item.kanji === '午前') {
                if (item.kanji.startsWith('〜')) {
                    koSpecial.data.push(item);
                    return;
                }
            }
        }

        // Special handling for さ-related items - assign to 〜さ section
        if (item.furigana.endsWith('さ') ||
            item.furigana.endsWith('ざ') ||
            item.furigana.endsWith('さい') ||
            item.furigana.endsWith('さつ') ||
            item.furigana.endsWith('さん')) {
            // Only if it's a suffix/counter (starts with 〜)
            if (item.kanji.startsWith('〜') || item.kanji === '冊' || item.kanji === '歳') {
                if (item.kanji.startsWith('〜') || item.kanji === '冊') {
                    saSpecial.data.push(item);
                    return;
                }
            }
        }

        // Special handling for し-related items - assign to 〜し section
        if (item.furigana.endsWith('し') ||
            item.furigana.endsWith('じ') ||
            item.furigana.endsWith('じかん') ||
            item.furigana.endsWith('しゅうかん') ||
            item.furigana.endsWith('じん')) {
            // Only if it's a suffix/counter (starts with 〜)
            if (item.kanji.startsWith('〜') || item.kanji.startsWith('~')) {
                shiSpecial.data.push(item);
                return;
            }
        }

        // Special handling for す-related items - assign to 〜す section
        if (item.furigana.endsWith('すぎ') ||
            item.furigana.endsWith('ずつ')) {
            // Only if it's a suffix/counter (starts with 〜)
            if (item.kanji.startsWith('〜')) {
                suSpecial.data.push(item);
                return;
            }
        }

        let firstChar = item.furigana.charAt(0);

        // Convert Katakana to Hiragana if necessary
        if (firstChar >= '\u30a0' && firstChar <= '\u30ff') {
            firstChar = String.fromCharCode(firstChar.charCodeAt(0) - 0x60);
        }

        const rowIndex = GOJUON_ROWS.findIndex(row => row.chars.includes(firstChar));

        if (rowIndex !== -1) {
            sections[rowIndex].data.push(item);
        } else {
            others.data.push(item);
        }
    });

    // Remove empty sections
    const nonEmptySections = sections.filter(section => section.data.length > 0);

    // Add 〜か section if it has items (insert after か section)
    if (kaSpecial.data.length > 0) {
        const kaIndex = nonEmptySections.findIndex(section => section.title === 'か');
        if (kaIndex !== -1) {
            nonEmptySections.splice(kaIndex + 1, 0, kaSpecial);
        } else {
            nonEmptySections.push(kaSpecial);
        }
    }

    // Add 〜がつ section if it has items (insert after 〜か section or か section)
    if (monthsSection.data.length > 0) {
        const kaSpecialIndex = nonEmptySections.findIndex(section => section.title === '〜か');
        if (kaSpecialIndex !== -1) {
            nonEmptySections.splice(kaSpecialIndex + 1, 0, monthsSection);
        } else {
            const kaIndex = nonEmptySections.findIndex(section => section.title === 'か');
            if (kaIndex !== -1) {
                nonEmptySections.splice(kaIndex + 1, 0, monthsSection);
            } else {
                nonEmptySections.push(monthsSection);
            }
        }
    }

    // Add 〜こ section if it has items (insert after こ section)
    if (koSpecial.data.length > 0) {
        const koIndex = nonEmptySections.findIndex(section => section.title === 'こ');
        if (koIndex !== -1) {
            nonEmptySections.splice(koIndex + 1, 0, koSpecial);
        } else {
            nonEmptySections.push(koSpecial);
        }
    }

    // Add 〜さ section if it has items (insert after さ section)
    if (saSpecial.data.length > 0) {
        const saIndex = nonEmptySections.findIndex(section => section.title === 'さ');
        if (saIndex !== -1) {
            nonEmptySections.splice(saIndex + 1, 0, saSpecial);
        } else {
            nonEmptySections.push(saSpecial);
        }
    }

    // Add 〜し section if it has items (insert after し section)
    if (shiSpecial.data.length > 0) {
        const shiIndex = nonEmptySections.findIndex(section => section.title === 'し');
        if (shiIndex !== -1) {
            nonEmptySections.splice(shiIndex + 1, 0, shiSpecial);
        } else {
            nonEmptySections.push(shiSpecial);
        }
    }

    // Add 〜す section if it has items (insert after す section)
    if (suSpecial.data.length > 0) {
        const suIndex = nonEmptySections.findIndex(section => section.title === 'す');
        if (suIndex !== -1) {
            nonEmptySections.splice(suIndex + 1, 0, suSpecial);
        } else {
            nonEmptySections.push(suSpecial);
        }
    }

    // Final safeguard: remove any sections with duplicate titles (keep the first one)
    const seenTitles = new Set<string>();
    const finalSections = nonEmptySections.filter(section => {
        if (seenTitles.has(section.title)) {
            return false;
        }
        seenTitles.add(section.title);
        return true;
    });

    return finalSections;
};
