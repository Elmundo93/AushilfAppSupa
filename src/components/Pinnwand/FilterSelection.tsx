import React from 'react';
import { View } from 'react-native';
import FilterAccordion from '../Accordion/FilterAccordion';
import { createRStyle } from 'react-native-full-responsive';

interface FilterSectionProps {
  selectedOption: string;
  selectedCategory: string;
  selectedLocation: string;
  handleOptionChange: (option: string) => void;
  handleCategoryChange: (category: string) => void;
  handleLocationChange: (location: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedOption,
  selectedCategory,
  selectedLocation,
  handleOptionChange,
  handleCategoryChange,
  handleLocationChange,
}) => {
  return (
    <View style={styles.filterContainer}>
      <FilterAccordion
        selectedOption={selectedOption}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        onOptionChange={handleOptionChange}
        onCategoryChange={handleCategoryChange}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
};

const styles = createRStyle({
  filterContainer: {
    marginBottom: 20,
  },
});

export default FilterSection;