import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

const years = [
  '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016',
  '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005'
];
const tags = ['双人', '多人'];

const FilterBar = () => {
  const [selectedYear, setSelectedYear] = React.useState('2024');
  const [selectedTag, setSelectedTag] = React.useState('双人');

  return (
    <div className=" p-4">
      <Tabs.Root defaultValue="2024">
        <Tabs.List className="flex space-x-8" aria-label="Filter options">
          {years.map((year) => (
            <Tabs.Trigger
              key={year}
              value={year}
              className={`px-2 py-1 hover:text-teal-400 transition-colors ${
                selectedYear === year ? 'text-teal-400' : ''
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <div className="mt-4 flex space-x-4">
        <span className="text-teal-400">Tags</span>
        {tags.map((tag) => (
          <button
            key={tag}
            className={`hover:text-teal-400 transition-colors ${
              selectedTag === tag ? 'text-teal-400' : ''
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
