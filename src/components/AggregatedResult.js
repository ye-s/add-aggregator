import React from 'react';

const AggregatedResult = props => {

  return (
    <div className="calculatedResult">
      <p>Clicks: <span>{props.clicks}</span></p>
      <p className="calculatedResult-impressions">Impressions: <span>{props.impressions}</span></p>
    </div>
  )
}
export default AggregatedResult;