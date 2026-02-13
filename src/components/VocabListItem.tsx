import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VocabItem } from '../data/vocab';

interface VocabListItemProps {
    item: VocabItem;
    onToggle: (id: string) => void;
}

export const VocabListItem: React.FC<VocabListItemProps> = ({ item, onToggle }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onToggle(item.id)} activeOpacity={0.7}>
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.kanji, item.completed && styles.textCompleted]}>{item.kanji}</Text>
                    <Text style={[styles.furigana, item.completed && styles.textCompleted]}>{item.furigana}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={[styles.nepali, item.completed && styles.textCompleted]}>{item.nepali}</Text>
                    <Text style={[styles.meaning, item.completed && styles.textCompleted]}>{item.meaning}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4A90E2',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    checkboxChecked: {
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    kanji: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#333',
    },
    furigana: {
        fontSize: 14,
        color: '#666',
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nepali: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    },
    meaning: {
        fontSize: 16,
        color: '#444',
    },
    textCompleted: {
        color: '#AAA',
        textDecorationLine: 'line-through',
    },
});
