import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AggregatedResult from './AggregatedResult';
import axios from 'axios';
import _ from 'lodash';

const SearchBar = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [impressions, setImpressions] = useState(0);

  useEffect(() => {
    axios.get('https://www.mocky.io/v2/5cd93aeb300000b721c014b0').then(result => {
      const fileData = result.data;
      convertCSVtoArray(fileData);
    });
    return () => {
    };
  }, []);

  const convertCSVtoArray = csv => {

    let channels = [];
    let campaigns = [];
    const allRowsArray = csv.split(/\n/);
    let allRowsLength = allRowsArray.length - 1;

    for (let i = 1; i < allRowsLength; i++ ) {
      const rowArray = allRowsArray[i].split(',');
      if (!_.find(channels, { label: rowArray[1] })) {
        channels.push({ 
          label: rowArray[1],
          value: i
        });
      }
      
      campaigns.push(
        {
          id: i,
          channel: rowArray[1],
          label: rowArray[0],
          clicks: +rowArray[2], // converting to Number
          impressions: +rowArray[3]
        }
      )
    }

    setOptions(channels.concat(campaigns));
    setIsLoading(false);
  }

  // Calculates clicks and impressions for input selection
  const handleChange = selectedOption => {
    if (!selectedOption) {
      setClicks(0);
      setImpressions(0);
      return;
    }
    let result = {
      clicks: 0,
      impressions: 0
    }
    if (selectedOption.hasOwnProperty('clicks')) {
      let { clicks, impressions } = selectedOption;

      result.clicks = clicks;
      result.impressions = impressions;
    } else {
      let filteredCampaings = _.filter(options, item => (
        item.channel === selectedOption.label
      ));

      result = _.reduce(filteredCampaings, function(sum, campaign) {
          sum.clicks += campaign.clicks;
          sum.impressions += campaign.impressions;
          return sum;
      }, { clicks: 0, impressions: 0 });
    }

    setClicks(result.clicks);
    setImpressions(result.impressions);
  };

  // Shows menu if user entered any data
  const onInputChange = inputValue => {
    if (inputValue && !menuIsOpen) {
      setMenuIsOpen(true);
    } else if(!inputValue && menuIsOpen){
      setMenuIsOpen(false);
    }
  }

  return (
    <div className="searchBlock">
      <p>Choose channel or campaign</p>
      <Select
        onInputChange={onInputChange}
        isSearchable={true}
        isFilterable={true}
        onChange={handleChange}
        menuIsOpen={menuIsOpen}
        options={ options }
        isLoading={isLoading}
        isClearable={true}
       />
       <AggregatedResult clicks={clicks} impressions={impressions} />
    </div>
  );
};

export default SearchBar;
