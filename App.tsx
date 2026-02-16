import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { VocabItem, vocabList } from './src/data/vocab';
import { VocabListItem } from './src/components/VocabListItem';
import { groupVocabByGojuon } from './src/utils/vocabUtils';

export default function App() {
  const [items, setItems] = useState<VocabItem[]>(vocabList);
  const [activeSection, setActiveSection] = useState(0);
  const sectionListRef = useRef<SectionList>(null);
  const sidebarRef = useRef<ScrollView>(null);
  const targetSectionRef = useRef<number | null>(null);

  const sections = useMemo(() => groupVocabByGojuon(items), [items]);

  const handleToggle = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const scrollToSection = (index: number) => {
    if (sections[index] && sectionListRef.current) {
      targetSectionRef.current = index;
      setActiveSection(index);

      try {
        sectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: true,
          viewPosition: 0,
          viewOffset: 0,
        });
      } catch (error) {
        console.log('Initial scroll failed:', error);
      }
    }
  };

  // Auto-scroll sidebar to keep active section in view
  React.useEffect(() => {
    if (sidebarRef.current) {
      // Approximate height of an anchor item (circle 32 + padding 4*2 = 40)
      const itemHeight = 40;
      sidebarRef.current.scrollTo({
        y: Math.max(0, (activeSection * itemHeight) - 100),
        animated: true,
      });
    }
  }, [activeSection]);

  const handleScrollToIndexFailed = (info: any) => {
    const targetIndex = targetSectionRef.current;
    if (targetIndex !== null) {
      setTimeout(() => {
        sectionListRef.current?.scrollToLocation({
          sectionIndex: targetIndex,
          itemIndex: 0,
          animated: true,
          viewPosition: 0,
        });
      }, 100);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      // Find the first visible item that belongs to a section
      const topItem = viewableItems[0];
      if (topItem.section) {
        const sectionTitle = topItem.section.title;
        const index = sections.findIndex(s => s.title === sectionTitle);
        if (index !== -1 && targetSectionRef.current === null) {
          setActiveSection(index);
        }
      }
    }
  }).current;

  const onMomentumScrollEnd = () => {
    targetSectionRef.current = null;
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>JLPT N5 Vocabulary</Text>
          <SectionList
            ref={sectionListRef}
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VocabListItem item={item} onToggle={handleToggle} />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onMomentumScrollEnd={onMomentumScrollEnd}
            initialNumToRender={50}
            maxToRenderPerBatch={50}
            windowSize={21}
          />
        </View>

        <View style={styles.sidebarContainer}>
          <ScrollView
            ref={sidebarRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarContent}
          >
            {sections.map((section, index) => (
              <TouchableOpacity
                key={section.title}
                onPress={() => scrollToSection(index)}
                style={styles.anchorItem}
              >
                <View style={[
                  styles.anchorCircle,
                  activeSection === index && styles.activeAnchorCircle
                ]}>
                  <Text style={[
                    styles.anchorText,
                    activeSection === index && styles.activeAnchorText
                  ]}>
                    {section.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 5,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 8,
    zIndex: 1,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  sidebarContainer: {
    width: 50,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
    paddingTop: 40,
  },
  sidebarContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  anchorItem: {
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  anchorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeAnchorCircle: {
    backgroundColor: '#E1F0FF',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  anchorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  activeAnchorText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
